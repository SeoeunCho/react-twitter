import { useState } from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import AuthForm from "components/auth/AuthForm";
import styled from "./Auth.module.scss";

import useTranslation from "hooks/useTranslation";
const AUTH_BG_URL = "/background.jpg";

export default function AuthPage() {
  const [newAccount, setNewAccount] = useState<boolean>(true);
  const toggleAccount = () => setNewAccount(!newAccount);
  const t = useTranslation();

  return (
    <div className={styled.container}>
      <div className={styled.authImage}>
        <img src={AUTH_BG_URL} alt="auth background" />
      </div>
      <div className={styled.auth}>
        <div className={styled.twitter__logo}>
          <AiOutlineTwitter />
        </div>
        <div className={styled.twitter__notification}>
          <span>{t("AUTH_TEXT")}</span>
        </div>
        {newAccount ? (
          <div className={styled.twitter__info}>
            <span>{t("AUTH_LOGIN_TEXT")}</span>
          </div>
        ) : (
          <div className={styled.twitter__info}>
            <span>{t("AUTH_SIGNUP_TEXT")}</span>
          </div>
        )}

        <AuthForm newAccount={newAccount} />

        {newAccount ? (
          <div className={styled.auth__notification}>
            <span>{t("NO_ACCOUNT")}</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                {t("SIGNUP_LINK")}
              </span>
            </div>
          </div>
        ) : (
          <div className={styled.auth__notification}>
            <span>{t("YES_ACCOUNT")}</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                {t("LOGIN_LINK")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
