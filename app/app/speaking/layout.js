// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Aqyl — айтылымды тексер · Qyzyl til",
  description: "Фразаны дауыстап айт — Aqyl дыбыстарыңды тыңдап, бағалап, кеңес береді.",
};

export default function Layout({ children }) {
  return children;
}
