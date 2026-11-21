// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Aqyl — жазуымды түзет · Qyzyl til",
  description: "Қазақша мәтініңді тексеріп, түзетілген нұсқасы мен қысқа түсіндірмесін ал.",
};

export default function Layout({ children }) {
  return children;
}
