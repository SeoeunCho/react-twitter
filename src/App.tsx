import { useEffect, useState } from "react";

import { getAuth } from "firebase/auth";
import { app } from "firebaseApp";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Loader from "components/loader/Loader";

import { RecoilRoot } from "recoil";
import Router from "pages/Router";

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [userObj, setUserObj] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    // 유저 상태 변화 추적(로그인, 로그아웃, 어플리케이션 초기화 시)
    const auth = getAuth(app);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserObj(user);
      } else {
        setIsAuthenticated(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <RecoilRoot>
      <ToastContainer
        theme="dark"
        autoClose={1000}
        hideProgressBar
        newestOnTop
      />
      {init ? (
        <Router isAuthenticated={isAuthenticated} userObj={userObj} />
      ) : (
        <Loader />
      )}
    </RecoilRoot>
  );
}

export default App;
