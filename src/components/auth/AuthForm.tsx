import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";
import styled from "./AuthForm.module.scss";

interface AuthProps {
  newAccount: boolean;
}

export default function AuthForm({ newAccount }: AuthProps) {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [select, setSelect] = useState<string>("");
  const navigate = useNavigate();
  const t = useTranslation();

  const errorMessages: any = {
    "(auth/email-already-in-use).": "이미 가입이 되어있는 이메일입니다.",
    "(auth/invalid-email).": "올바르지 않은 이메일 형식입니다.",
    "(auth/weak-password)": "비밀번호를 최소 6글자 이상 입력해주세요.",
    "(auth/wrong-password).": "이메일이나 비밀번호가 틀립니다.",
    "(auth/too-many-requests)":
      "로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 비밀번호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다.",
    "(auth/user-not-found)": "가입된 아이디를 찾을 수 없습니다.",
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      if (newAccount) {
        // Log in
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
        toast.success(t("SUCCESS_LOGIN_TOAST"));
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
        toast.success(t("SUCCESS_SIGNIN_TOAST"));
      }
    } catch (error: any) {
      const errorKey = Object.keys(errorMessages).find((key) =>
        error.message.includes(key)
      );
      const errorMessage = errorKey ? errorMessages[errorKey] : error.message;
      toast?.error(errorMessage);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!value?.match(validRegex)) {
        setError(t("EMAIL_CHECK_TOAST"));
      } else {
        setError("");
      }
    }

    if (newAccount) {
      // Log in
      if (name === "password") {
        setPassword(value);

        if (value?.length < 8) {
          setError(t("PW_CHECK_TOAST"));
        } else {
          setError("");
        }
      }
    } else {
      // Sign up
      if (name === "password") {
        setPassword(value);

        if (value?.length < 8) {
          setError(t("PW_CHECK_TOAST"));
        } else if (value !== passwordConfirmation) {
          setError(t("PW_RECHECK_TOAST"));
        } else {
          setError("");
        }
      }

      if (name === "password_confirmation") {
        setPasswordConfirmation(value);

        if (value?.length < 8) {
          setError(t("PW_CHECK_TOAST"));
        } else if (value !== password) {
          setError(t("PW_RECHECK_TOAST"));
        } else {
          setError("");
        }
      }
    }
  };

  const onClickSocialLogin = async (e: any) => {
    const {
      target: { name },
    } = e;

    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GoogleAuthProvider | GithubAuthProvider
    )
      .then((result) => {
        console.log(result);
        toast.success(t("LOGIN_TOAST"));
      })
      .catch((error: any) => {
        const errorKey = Object.keys(errorMessages).find((key) =>
          error.message.includes(key)
        );
        const errorMessage = errorKey ? errorMessages[errorKey] : error.message;
        toast?.error(errorMessage);
      });
  };

  return (
    <>
      <div className={styled.container}>
        <form onSubmit={onSubmit} className={styled.wrapper}>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            required
            className={`${styled.authInput} ${
              select === "email" && styled.select
            }`}
            onChange={onChange}
            onFocus={() => setSelect("email")}
            onBlur={() => setSelect("")}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            required
            className={`${styled.authInput} ${
              select === "password" && styled.select
            }`}
            onChange={onChange}
            onFocus={() => setSelect("password")}
            onBlur={() => setSelect("")}
          />
          {newAccount ? null : (
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              required
              className={`${styled.authInput} ${
                select === "passwordConfirmation" && styled.select
              }`}
              onChange={onChange}
              onFocus={() => setSelect("passwordConfirmation")}
              onBlur={() => setSelect("")}
            />
          )}
          <button
            type="submit"
            className={`${styled.authInput} ${styled.authSubmit}`}
            disabled={error?.length > 0}
          >
            {newAccount ? t("BUTTON_LOGIN") : t("BUTTON_SIGNUP")}
          </button>
          {error && error?.length > 0 && (
            <span className={styled.authError}>{error}</span>
          )}
        </form>
      </div>
      {newAccount ? (
        <>
          <div className={styled.separator}>
            <p>또는</p>
          </div>
          <div className={styled.authBtns}>
            <button
              type="button"
              name="google"
              className={styled.authBtn}
              onClick={onClickSocialLogin}
            >
              <FcGoogle />
              {t("LOGIN_WITH_GOOGLE")}
            </button>
            <button
              type="button"
              name="github"
              className={styled.authBtn}
              onClick={onClickSocialLogin}
            >
              <AiFillGithub />
              {t("LOGIN_WITH_GITHUB")}
            </button>
          </div>
        </>
      ) : (
        <div className={styled.authBtns}></div>
      )}
    </>
  );
}
