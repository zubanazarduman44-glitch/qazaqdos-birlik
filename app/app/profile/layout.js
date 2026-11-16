// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Профиль · Qyzyl til",
  description: "Прогресің, деңгейің, жетістіктерің және баптаулар.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
