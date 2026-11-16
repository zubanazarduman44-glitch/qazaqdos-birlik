import "../auth.css";
import AuthForm from "../components/AuthForm";

export const metadata = {
  title: "Кіру · Qyzyl til",
  description: "Qyzyl til аккаунтыңа кіріп, прогресіңді кез келген құрылғыда жалғастыр.",
};

export default function Page() {
  return <AuthForm mode="login" />;
}
