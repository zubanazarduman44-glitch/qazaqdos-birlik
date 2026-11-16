// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Әкімші · Qyzyl til",
  description: "Әкімші беті.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
