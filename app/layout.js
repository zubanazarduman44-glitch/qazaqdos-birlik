import "./globals.css";
import "./app.css";
import "./nat.css";
import "./kiiz.css";
import "./lesson.css";
import "./games.css";
import "./travel.css";
import "./aqyl.css";
import "./qyzyl.css"; // Qyzyl til қызыл палитрасы — осы жолды өшірсең, бұрынғы көк «Ақ киіз» түстері қайтады
import "./shell.css";
import "./paper.css";
import "./anim.css";
import "./rtl.css";
import { AppProvider } from "./components/Store";

const FONT_CSS = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Unbounded:wght@600;800&display=swap";

export const metadata = {
  title: "Qyzyl til — қазақ тілін Aqyl-мен бірге үйрен",
  description:
    "Qyzyl til: «Өнер алды — қызыл тіл». Қазақстанды аралап, ұлттық ойындар ойнап, Aqyl атты виртуалды доспен сөйлесе отырып қазақ тілін үйрен. Учите казахский язык в путешествии и в игре.",
  applicationName: "Qyzyl til",
  icons: { icon: "/icon.svg" },
  metadataBase: new URL("https://tilim-kz.vercel.app"),
  openGraph: { type: "website", siteName: "Qyzyl til", locale: "kk_KZ", title: "Qyzyl til — қазақ тілін Aqyl-мен бірге үйрен", url: "/" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf6ee",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kk" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Қаріп CSS-і бетті салуды бөгемейді: алдын ала жүктеліп, скрипт арқылы қосылады (display=swap — алдымен жүйелік қаріп) */}
        <link rel="preload" as="style" href={FONT_CSS} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var l=document.createElement("link");l.rel="stylesheet";l.href=${JSON.stringify(FONT_CSS)};document.head.appendChild(l)})()` }} />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
