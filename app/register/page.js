import "../auth.css";
import AuthForm from "../components/AuthForm";

export const metadata = {
  title: "Тіркелу · Qyzyl til",
  description: "Тегін тіркеліп, қазақ тілін Aqyl-мен бірге үйренуді баста.",
};

export default function Page() {
  return <AuthForm mode="register" />;
}
