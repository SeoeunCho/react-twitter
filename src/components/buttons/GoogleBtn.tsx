import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "firebaseApp";
import { setCurrentUser, setLoginToken } from "reducer/user";
import { FcGoogle } from "react-icons/fc";
import { AuthProps } from "components/auth/AuthForm";
import styled from "../../pages/auth/Auth.module.scss";
import useTranslation from "hooks/useTranslation";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";
const PROFILE_BG_URL = "/bgimg.jpg";

export const GoogleBtn = ({ newAccount }: AuthProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const onSocialClick = async (e: any) => {
    let provider;
    let user: any;

    const auth = getAuth();
    provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider as GoogleAuthProvider).then(
        async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          user = result.user;

          const docRef = doc(db, "Users", user.email);
          await getDoc(docRef).then(async (docSnap) => {
            if (docSnap.exists()) {
              dispatch(setLoginToken("login"));
              dispatch(
                setCurrentUser({
                  ...docSnap.data(),
                })
              );
            } else {
              const usersRef = collection(db, "Users");
              await setDoc(doc(usersRef, user.email), {
                uid: user.uid,
                displayName: user.email.split("@")[0],
                email: user.email,
                photoURL: PROFILE_DEFAULT_URL,
                createdAtId: Date.now(),
                description: "",
                bgURL: PROFILE_BG_URL,
                bookmark: [],
                followerAt: [],
                followingAt: [],
                follower: [],
                following: [],
                reNweet: [],
                token: token,
              });
              dispatch(setLoginToken("login"));
              dispatch(
                setCurrentUser({
                  uid: user.uid,
                  displayName: user.email.split("@")[0],
                  email: user.email,
                  photoURL: PROFILE_DEFAULT_URL,
                  bgURL: PROFILE_BG_URL,
                  description: "",
                  createdAtId: Date.now(),
                  bookmark: [],
                  followerAt: [],
                  followingAt: [],
                  follower: [],
                  following: [],
                  reNweet: [],
                })
              );
            }
          });
        }
      );
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Google 로그인 오류");
    }
  };

  return (
    <>
      {newAccount && (
        <button
          onClick={onSocialClick}
          name="google"
          className={styled.authBtn}
        >
          <FcGoogle />
          {t("LOGIN_WITH_GOOGLE")}
        </button>
      )}
    </>
  );
};
