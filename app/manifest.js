// Веб-қолданба манифесі (Next.js файл конвенциясы: /manifest.webmanifest, <link rel="manifest"> өзі қосылады)
export default function manifest() {
  return {
    name: "Qyzyl til — қазақ тілін Aqyl-мен бірге үйрен",
    short_name: "Qyzyl til",
    description: "Қазақстанды аралап, ұлттық ойындар ойнап, Aqyl атты виртуалды доспен сөйлесе отырып қазақ тілін үйрен.",
    lang: "kk",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#faf6ee",
    theme_color: "#faf6ee",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
