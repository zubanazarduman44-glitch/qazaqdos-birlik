// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Aqyl — жазу мен айтылымды тексеру · Qyzyl til",
  description: "Қазақша жаз не дауыстап айт — Aqyl қатеңді тауып, дұрыс нұсқасын көрсетіп, түсіндіреді.",
};

export default function Layout({ children }) {
  return children;
}
