import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";
import RegisterTradeNation from "@/pages/auth/themes/RegisterTradeNation.tsx";

export default function SignUpPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      navigate("/main");
    }
  }, [user, token, navigate]);


  return <RegisterTradeNation />;
}
