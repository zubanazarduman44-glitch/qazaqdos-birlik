import "./globals.css";
import "./app.css";
import "./nat.css";
import "./kiiz.css";
import "./lesson.css";
import "./games.css";
import "./travel.css";
import "./aqyl.css";
import "./qyzyl.css"; // Qyzyl til қызыл палитрасы — осы жолды өшірсең, бұрынғы көк «Ақ киіз» түстері қайтады
import "./rtl.css";
import { AppProvider } from "./components/Store";

export const metadata = {
  title: "Qyzyl til — қазақ тілін Aqyl-мен бірге үйрен",
  description:
    "Qyzyl til: «Өнер алды — қызыл тіл». Қазақстанды аралап, ұлттық ойындар ойнап, Aqyl атты виртуалды доспен сөйлесе отырып қазақ тілін үйрен. Учите казахский язык в путешествии и в игре.",
  applicationName: "Qyzyl til",
  icons: { icon: "/icon.svg" },
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
        <link
          href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Unbounded:wght@600;800&display=swap&subset=cyrillic,cyrillic-ext"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
