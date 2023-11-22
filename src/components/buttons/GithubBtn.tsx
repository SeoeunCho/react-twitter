import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoginToken } from "reducer/user";
import { AiFillGithub } from "react-icons/ai";
import { AuthProps } from "components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { auth, db } from "firebaseApp";
import styled from "../../pages/auth/Auth.module.scss";
import useTranslation from "hooks/useTranslation";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";
const PROFILE_BG_URL = "/bgimg.jpg";

export const GithubBtn = ({ newAccount }: AuthProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const onSocialClick = async (e: any) => {
    let provider;
    let user: any;

    provider = new GithubAuthProvider();
    
    try {
      await signInWithPopup(auth, provider as GithubAuthProvider).then(
        async (result) => {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          user = result.user;
          if (user?.email) {
            const docRef = doc(db, "Users", `${user.email}`);
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
                await setDoc(doc(usersRef, `${user.email}`), {
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
                  reTweet: [],
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
                    reTweet: [],
                  })
                );
              }
            });
          }
        }
      );
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Github 로그인 오류");
    }
  };

  return (
    <>
      {newAccount && (
        <button
          onClick={onSocialClick}
          name="github"
          className={styled.authBtn}
        >
          <AiFillGithub />
          {t("LOGIN_WITH_GITHUB")}
        </button>
      )}
    </>
  );
};
