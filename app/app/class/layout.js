// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Менің сыныбым · Qyzyl til",
  description: "Мұғалім сынып ашып, тапсырма береді; оқушылар код арқылы қосылып, прогресін бөліседі.",
};

export default function Layout({ children }) {
  return children;
}
