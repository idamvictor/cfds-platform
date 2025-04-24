import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUserStore from "@/store/userStore";
import LoginTradeNation from "@/pages/auth/themes/LoginTradeNation.tsx";
import LoginBasic from "@/pages/auth/themes/LoginBasic.tsx";
import LoginRegisterTradeNation from "@/pages/auth/themes/LoginRegisterTradeNation.tsx";


export default function LoginPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [searchParams] = useSearchParams();


  const loginType = searchParams.get("type") || "trade_nation_two";

  useEffect(() => {
    if (user && token) {
      navigate("/main");
    }
  }, [user, token, navigate]);

  if (loginType === "basic") {
    return <LoginBasic />;
  }

  if (loginType === "trade_nation_two") {
    return <LoginRegisterTradeNation />;
  }

  return <LoginTradeNation />;
}
