import { useEffect, useState } from "react";

export default function useLogoutModalClick(logoutRef: any) {
  const [userLogout, setUserLogout] = useState(false);

  useEffect(() => {
    // nweetEct가 true면 return;으로 인해 함수 종료(렌더 후 클릭 시 에러 방지)
    if (!userLogout) return;

    const handleClick = (e: any) => {
      if (!logoutRef.current.contains(e.target)) {
        setUserLogout(false);
      } else if (logoutRef.current === null) {
        return;
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [logoutRef, userLogout]);

  return { userLogout, setUserLogout };
}
