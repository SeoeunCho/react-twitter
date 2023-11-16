import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { divide } from "lodash";
import { IoIosArrowBack, IoMdExit } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCurrentUser, setLoginToken } from "reducer/user";

interface HeaderProps {
  menu?: string;
  text: string | any;
  myTweets?: [];
  creatorInfo?: [] | any;
}

export default function Header({
  menu,
  text,
  myTweets,
  creatorInfo,
}: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const onLogOutClick = async () => {
    const confirm = window.confirm(t("CHECK_LOGOUT_TOAST"));
    if (confirm) {
      const auth = getAuth(app);
      await signOut(auth);
      dispatch(setLoginToken("logout"));
      dispatch(
        setCurrentUser({
          photoURL: "",
          userEmail: "",
          displayName: "",
          email: "",
          description: "",
          bgURL: "",
          bookmark: [],
          follower: [],
          following: [],
          reTweet: [],
          reTweetAt: [],
        })
      );
      navigate("/auth");
      toast.success(t("LOGOUT_TOAST"));
    }
  };

  return (
    <>
      {menu === "home" ? (
        <div className="main__category">
          <div className="main_text">
            <h2>{t(text)}</h2>
          </div>
        </div>
      ) : (
        <div className="minor__category">
          <div
            className="minor__icon"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IoArrowBackOutline />
          </div>
          <div className="userInfo">
            <p className="category__name">
              {menu === "profile" ? text : t(text)}
            </p>
            {myTweets && (
              <p className="category__sub">{myTweets.length} 트윗</p>
            )}

            {creatorInfo && (
              <p className="category__sub">
                @{creatorInfo?.email?.split("@")[0]}
              </p>
            )}
          </div>
          {menu === "profile" && (
            <div className="minor__iconExit" onClick={onLogOutClick}>
              <IoMdExit />
            </div>
          )}
        </div>
      )}
    </>
  );
}
