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
import { Golos_Text, Unbounded } from "next/font/google";

// Қаріптер сайттың өз доменінен беріледі (next/font): Google-ге бөлек қосылу жоқ, алдын ала жүктеледі,
// ал қаріп келгенше көрсетілетін жүйелік қаріп өлшемі сәйкестендірілген — мәтін «секірмейді».
// cyrillic-ext — қазақтың ә, ғ, қ, ң, ө, ұ, ү, һ, і әріптері үшін.
const golos = Golos_Text({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-golos" });
const unbounded = Unbounded({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], weight: ["600", "800"], display: "swap", variable: "--font-unbounded" });

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
  themeColor: "#fcfaf6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kk" data-theme="light" className={`${golos.variable} ${unbounded.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
