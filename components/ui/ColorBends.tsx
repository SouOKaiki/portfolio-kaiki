"use client";

import { useEffect, useRef } from "react";

// Fundo animado: bandas de cor onduladas, com warp, ruído e parallax do mouse.
// WebGL puro (sem libs). Roda como camada de fundo, atrás de todo o conteúdo.
// Cai pra null em dispositivos sem WebGL ou que pediram menos movimento.

interface ColorBendsProps {
  colors?: [string, string, string];
  /** Inclinação das bandas, em graus */
  rotation?: number;
  /** Velocidade da animação (0.1 = lento, 1 = rápido) */
  speed?: number;
  /** Zoom geral */
  scale?: number;
  /** Quantas bandas cabem na tela */
  frequency?: number;
  /** Intensidade da distorção das bandas (0–1) */
  warpStrength?: number;
  /** O quanto o mouse empurra as bandas (0–1) */
  mouseInfluence?: number;
  /** Granularidade/ruído (0–1) */
  noise?: number;
  /** Parallax sutil ao mover o mouse (0–1) */
  parallax?: number;
  /** Saturação/brilho das cores */
  intensity?: number;
  /** Largura relativa das bandas */
  bandWidth?: number;
  /** Cor de fundo das partes "vazias" */
  background?: string;
  /** Opacidade do efeito (deixe baixo pra fundo discreto) */
  opacity?: number;
}

export function ColorBends({
  colors = ["#fd0757", "#8d50fe", "#ffde59"],
  rotation = 12,
  speed = 1.5,
  scale = 1,
  frequency = 2.5,
  warpStrength = 0.95,
  mouseInfluence = 1,
  noise = 0.23,
  parallax = 0.1,
  intensity = 0.1,
  bandWidth = 3.5,
  background = "#050507",
  opacity = 0.05,
}: ColorBendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // WebGL indisponível: simplesmente não renderiza nada.

    // ----- Shaders -----
    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    // O fragment shader desenha bandas senoidais com warp + ruído. Cada banda
    // pega uma de 3 cores e mistura suavemente entre vizinhas.
    const frag = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;       // 0..1
      uniform float u_rotation;    // graus
      uniform float u_speed;
      uniform float u_scale;
      uniform float u_frequency;
      uniform float u_warp;
      uniform float u_mouseInfl;
      uniform float u_noise;
      uniform float u_parallax;
      uniform float u_intensity;
      uniform float u_bandWidth;
      uniform vec3  u_c1;
      uniform vec3  u_c2;
      uniform vec3  u_c3;
      uniform vec3  u_bg;
      uniform float u_opacity;

      // Hash determinístico simples para o ruído.
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      // Value noise interpolado.
      float vnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      // Mistura suave entre 3 cores ao longo de t (0..1).
      vec3 palette(float t) {
        t = fract(t);
        if (t < 0.5) return mix(u_c1, u_c2, smoothstep(0.0, 0.5, t));
        return mix(u_c2, u_c3, smoothstep(0.5, 1.0, t));
      }

      void main() {
        // Coordenada normalizada, centrada (aspect-corrected).
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

        // Parallax sutil do mouse.
        vec2 mouse = (u_mouse - 0.5);
        uv += mouse * u_parallax;

        // Rotação da "lâmina" diagonal.
        float a = radians(u_rotation);
        float cs = cos(a), sn = sin(a);
        vec2 ruv = mat2(cs, -sn, sn, cs) * uv;

        float t = u_time * u_speed;

        // Warp lento, só pra lâmina "respirar" de forma orgânica (sem ondular muito).
        float w = vnoise(ruv * 0.8 + vec2(t * 0.15, -t * 0.10)) - 0.5;
        ruv.x += w * u_warp * 0.6;

        // ===== Lâmina diagonal de luz =====
        // d = distância à linha central (x=0 no espaço rotacionado).
        // Quanto menor d, mais luz. Cria a sensação de "feixe" atravessando a tela.
        float d = abs(ruv.x);

        // Núcleo afiado (mais brilhante) e halo amplo (suave).
        float core = exp(-d * 18.0) * 0.9;
        float halo = exp(-d * 3.5) * 0.55;
        float beam = core + halo;

        // Mistura rosa-avermelhado (u_c1) com roxo (u_c2) ao longo da diagonal.
        // u_c3 é mantido como reforço de magenta sutil no núcleo.
        float mixT = smoothstep(-0.6, 0.6, ruv.y + sin(t * 0.4) * 0.1);
        vec3 beamColor = mix(u_c1, u_c2, mixT);
        beamColor = mix(beamColor, u_c3, core * 0.25);

        // Acúmulo: fundo quase preto + lâmina luminosa.
        vec3 col = u_bg + beamColor * beam * u_intensity;

        // Vinheta circular escurecendo o que se afasta do centro (foco no conteúdo).
        float vign = smoothstep(1.3, 0.2, length(uv));
        col *= mix(0.55, 1.0, vign);

        // Ruído finíssimo só pra evitar banding (sem "scanlines").
        float n = (hash(gl_FragCoord.xy + t) - 0.5) * u_noise;
        col += n;

        // Opacidade final: mistura com o fundo escuro pra controlar a presença geral.
        col = mix(u_bg, col, u_opacity);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.warn("ColorBends shader error:", gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Quad cobrindo a tela inteira (dois triângulos).
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("u_res")!;
    const uTime = u("u_time")!;
    const uMouse = u("u_mouse")!;
    const uRot = u("u_rotation")!;
    const uSpeed = u("u_speed")!;
    const uScale = u("u_scale")!;
    const uFreq = u("u_frequency")!;
    const uWarp = u("u_warp")!;
    const uMI = u("u_mouseInfl")!;
    const uNoise = u("u_noise")!;
    const uPar = u("u_parallax")!;
    const uInt = u("u_intensity")!;
    const uBW = u("u_bandWidth")!;
    const uC1 = u("u_c1")!;
    const uC2 = u("u_c2")!;
    const uC3 = u("u_c3")!;
    const uBg = u("u_bg")!;
    const uOp = u("u_opacity")!;

    const c1 = hexToRgb(colors[0]);
    const c2 = hexToRgb(colors[1]);
    const c3 = hexToRgb(colors[2]);
    const bg = hexToRgb(background);
    gl.uniform3f(uC1, c1[0], c1[1], c1[2]);
    gl.uniform3f(uC2, c2[0], c2[1], c2[2]);
    gl.uniform3f(uC3, c3[0], c3[1], c3[2]);
    gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
    gl.uniform1f(uRot, rotation);
    gl.uniform1f(uSpeed, speed);
    gl.uniform1f(uScale, scale);
    gl.uniform1f(uFreq, frequency);
    gl.uniform1f(uWarp, warpStrength);
    gl.uniform1f(uMI, mouseInfluence);
    gl.uniform1f(uNoise, noise);
    gl.uniform1f(uPar, parallax);
    gl.uniform1f(uInt, intensity);
    gl.uniform1f(uBW, bandWidth);
    gl.uniform1f(uOp, opacity);

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: 0.5, y: 0.5 }; // alvo (0..1)
    const mouseSmooth = { x: 0.5, y: 0.5 }; // suavizado

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    const start = performance.now();
    let raf = 0;
    const render = () => {
      const t = (performance.now() - start) / 1000;
      // Suavização do mouse pra parallax confortável.
      mouseSmooth.x += (mouse.x - mouseSmooth.x) * 0.06;
      mouseSmooth.y += (mouse.y - mouseSmooth.y) * 0.06;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseSmooth.x, mouseSmooth.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [
    colors,
    rotation,
    speed,
    scale,
    frequency,
    warpStrength,
    mouseInfluence,
    noise,
    parallax,
    intensity,
    bandWidth,
    background,
    opacity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-30"
    />
  );
}

// "#rrggbb" -> [r,g,b] em 0..1
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
