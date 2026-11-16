// Бөлімнің <title> мен сипаттамасы (бет өзі "use client" болғандықтан, метадеректер осында). Көрініске әсер етпейді.
export const metadata = {
  title: "Танысу · Qyzyl til",
  description: "Қазақ тілін үйренуді бастау: есімің, мақсатың және түсіндіру тілі.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
