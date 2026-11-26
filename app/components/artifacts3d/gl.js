// WebGL бар-жоғын three.js-сіз тексеру (галерея алғаш ашылғанда ауыр кітапхана керек емес).
let cached = null;
export function hasWebGL() {
  if (cached !== null) return cached;
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    cached = !!gl;
    const lose = gl && gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext(); // сынақ контекстін бірден босатамыз
  } catch {
    cached = false;
  }
  return cached;
}
export const markNoWebGL = () => {
  cached = false;
};
