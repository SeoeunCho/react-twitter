import { AiOutlineTwitter } from "react-icons/ai";
import AuthForm from "components/auth/AuthForm";
import styled from "./Auth.module.scss";
import authBg from "../../image/background.jpg";
import { useState } from "react";
import useTranslation from "hooks/useTranslation";

export default function AuthPage() {
  const [newAccount, setNewAccount] = useState<boolean>(true);
  const t = useTranslation();

  const toggleAccount = () => setNewAccount(!newAccount);

  return (
    <div className={styled.container}>
      <div className={styled.authImage}>
        <img src={authBg} alt="auth bg" />
      </div>
      <div className={styled.auth}>
        <div className={styled.xwitter__logo}>
          <AiOutlineTwitter />
        </div>
        <div className={styled.xwitter__notice}>
          <span>{t("AUTH_TEXT")}</span>
        </div>
        {newAccount ? (
          <div className={styled.xwitter__info}>
            <span>{t("AUTH_LOGIN_TEXT")}</span>
          </div>
        ) : (
          <div className={styled.xwitter__info}>
            <span>{t("AUTH_SIGNUP_TEXT")}</span>
          </div>
        )}
        <AuthForm newAccount={newAccount} />

        {newAccount ? (
          <div className={styled.auth__notice}>
            <span>{t("NO_ACCOUNT")}</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                {t("SIGNUP_LINK")}
              </span>
            </div>
          </div>
        ) : (
          <div className={styled.auth__notice}>
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
