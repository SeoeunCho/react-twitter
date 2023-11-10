import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { divide } from "lodash";
import { IoIosArrowBack, IoMdExit } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header({ menu, text }: { menu: string; text: any }) {
  const navigate = useNavigate();

  const t = useTranslation();

  const onLogOutClick = async () => {
    const confirm = window.confirm(t("CHECK_LOGOUT_TOAST"));
    if (confirm) {
      const auth = getAuth(app);
      await signOut(auth);
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
          {/* <button
    type="button"
    onClick={() => {
      navigate(-1);
    }}
  >
    <IoIosArrowBack className="post__header-btn" />
  </button> */}
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
            <p className="category__name">{t(text)}</p>
            {/* {myNweets && (
              <p className="category__sub">{myNweets.length} 트윗</p>
            )} */}

            {/* {creatorInfo && (
              <p className="category__sub">
                @{creatorInfo.email?.split("@")[0]}
              </p>
            )} */}
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
