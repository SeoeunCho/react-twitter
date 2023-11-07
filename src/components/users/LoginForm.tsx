import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const t = useTranslation();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success(t("SUCCESS_LOGIN_TOAST"));
    } catch (error: any) {
      toast.error(error?.code);
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

    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError(t("PW_CHECK_TOAST"));
      } else {
        setError("");
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
      .catch((error) => {
        console.log(error);
        const errorMessage = error?.message;
        toast?.error(errorMessage);
      });
  };

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">{t("MENU_LOGIN")}</div>
      <div className="form__block">
        <label htmlFor="email">{t("FORM_EMAIL")}</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          required
          onChange={onChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">{t("FORM_PASSWORD")}</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={onChange}
          required
        />
      </div>
      {error && error?.length > 0 && (
        <div className="form__block">
          <label className="form__error">{error}</label>
        </div>
      )}

      <div className="form__block">
        {t("NO_ACCOUNT")}
        <Link to="/users/signup" className="form__link">
          {t("SIGNUP_LINK")}
        </Link>
      </div>
      <div className="form__block--lg">
        <button
          type="submit"
          className="form__btn--submit"
          disabled={error?.length > 0}
        >
          {t("LOGIN_LINK")}
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="google"
          className="form__btn--google"
          onClick={onClickSocialLogin}
        >
          {t("LOGIN_WITH_GOOGLE")}
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="github"
          className="form__btn--github"
          onClick={onClickSocialLogin}
        >
          {t("LOGIN_WITH_GITHUB")}
        </button>
      </div>
    </form>
  );
}
