import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUserStore from "@/store/userStore";
import LoginTradeNation from "@/pages/auth/themes/LoginTradeNation.tsx";
import LoginBasic from "@/pages/auth/themes/LoginBasic.tsx";


export default function LoginPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [searchParams] = useSearchParams();


  const loginType = searchParams.get("type") || "tradenation";

  useEffect(() => {
    if (user && token) {
      navigate("/main");
    }
  }, [user, token, navigate]);

  if (loginType === "basic") {
    return <LoginBasic />;
  }

  return <LoginTradeNation />;
}
