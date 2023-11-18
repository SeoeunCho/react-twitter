import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app, db } from "firebaseApp";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";
import styled from "./AuthForm.module.scss";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { setCurrentUser, setLoginToken } from "reducer/user";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";
const PROFILE_BG_URL = "/bgimg.jpg";

export interface AuthProps {
  newAccount: boolean;
}

export default function AuthForm({ newAccount }: AuthProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [select, setSelect] = useState<string>("");
  const dispatch = useDispatch();
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
    "(auth/invalid-login-credentials)": "가입된 아이디를 찾을 수 없습니다.",
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      if (newAccount) {
        // Log in
        await signInWithEmailAndPassword(auth, email, password).then(
          async (result: any) => {
            let signUser = result?.user;
            const docRef = doc(db, "Users", signUser?.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              dispatch(setLoginToken("login"));
              dispatch(
                setCurrentUser({
                  ...docSnap.data(),
                })
              );
            } else {
              console.log("error");
            }
          }
        );
        navigate("/");
        toast.success(t("SUCCESS_LOGIN_TOAST"));
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password).then(
          async (result) => {
            let createUser: any = result.user;
            const usersRef = collection(db, "Users");
            await setDoc(doc(usersRef, createUser?.email), {
              uid: createUser.uid,
              displayName: createUser.email.split("@")[0],
              email: createUser.email,
              photoURL: PROFILE_DEFAULT_URL,
              createdAtId: Date.now(),
              description: "",
              bgURL: PROFILE_BG_URL,
              bookmark: [],
              followerAt: [],
              followingAt: [],
              follower: [],
              following: [],
              reTweet: [],
            });
            dispatch(setLoginToken("login"));
            dispatch(
              setCurrentUser({
                uid: createUser.uid,
                displayName: createUser.email.split("@")[0],
                email: createUser.email,
                photoURL: PROFILE_DEFAULT_URL,
                bgURL: PROFILE_BG_URL,
                description: "",
                createdAtId: Date.now(),
                bookmark: [],
                followerAt: [],
                followingAt: [],
                follower: [],
                following: [],
                reTweet: [],
              })
            );
          }
        );
      }
      navigate("/");
      toast.success(t("SUCCESS_SIGNIN_TOAST"));
    } catch (error: any) {
      console.log("error", error, error.message);
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

  return (
    <>
      <div className={styled.container}>
        <form onSubmit={onSubmit} className={styled.wrapper}>
          <input
            type="email"
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
        </>
      ) : (
        <div className={styled.authBtns}></div>
      )}
    </>
  );
}
