import "./globals.css";
import "./app.css";
import { AppProvider } from "./components/Store";

export const metadata = {
  title: "TILIM — қазақ тілін Qyran-мен бірге үйрен",
  description:
    "TILIM: Қазақстанды аралап, ұлттық ойындар ойнап, Qyran атты виртуалды доспен сөйлесе отырып қазақ тілін үйрен. Учите казахский язык в путешествии и в игре.",
  applicationName: "TILIM",
  icons: { icon: "/icon.svg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071428" },
    { media: "(prefers-color-scheme: light)", color: "#cfeeff" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="kk" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Unbounded:wght@500;600;700;800&display=swap&subset=cyrillic,cyrillic-ext"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('qd_theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <div className="sky-fx" aria-hidden="true">
          <span className="cloud" />
          <span className="cloud" />
          <span className="cloud" />
          <span className="stars" />
        </div>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
