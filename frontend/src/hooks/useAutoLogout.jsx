import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const useAutoLogout = (isActive) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isActive) return; // ✅ control here

    let timer;

    const logout = () => {
      console.log("User inactive → logout");
      navigate("/");
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, 15 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isActive]); // ✅ dependency added
};

export default useAutoLogout;