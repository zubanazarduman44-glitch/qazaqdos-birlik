// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Ұлттық ойындар · Qyzyl til",
  description: "Бәйге, арқан тартыс, асық ату және басқа ұлттық ойындар арқылы қазақ сөздерін үйрен.",
};

export default function Layout({ children }) {
  return children;
}
