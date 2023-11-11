import { BiCheck } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";
import styled from "./LogoutModal.module.scss";
import useTranslation from "hooks/useTranslation";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function LogoutModal({ user, onLogOutClick }: any) {
  const t = useTranslation();

  return (
    <div className={styled.container__box}>
      <div className={styled.container}>
        <div className={`${styled.btn} ${styled.updateBtn}`}>
          <div className={styled.leftBar__userInfo}>
            <div className={styled.userInfo__profile}>
              <img
                src={user.photoURL || PROFILE_DEFAULT_URL}
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.userInfo__name}>
              <p>{user.displayName || user?.email?.split("@")[0]}</p>
              <p>@{user?.email?.split("@")[0]}</p>
            </div>
            <div className={styled.userInfo__etc}>
              <BiCheck />
            </div>
          </div>
        </div>
        <div
          className={`${styled.btn} ${styled.deleteBtn}`}
          onClick={onLogOutClick}
        >
          <div className={styled.userInfo__etc}>
            <IoMdExit />
          </div>
          <p>{t("MENU_LOGOUT")}</p>
        </div>
        <div className={styled.box__triangle_none}></div>
        <div className={styled.box__triangle}>
          <GoTriangleDown />
        </div>
      </div>
    </div>
  );
}
