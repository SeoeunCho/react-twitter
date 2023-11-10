import { BiCheck } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";
import styled from "./LogoutModal.module.scss";

export default function LogoutModal({ userInfo, onLogOutClick }: any) {
  
  return (
    <div className={styled.container__box}>
      <div className={styled.container}>
        <div className={`${styled.btn} ${styled.updateBtn}`}>
          <div className={styled.leftBar__userInfo}>
            <div className={styled.userInfo__profile}>
              <img
                src={userInfo.photoURL}
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.userInfo__name}>
              <p>{userInfo.displayName}</p>
              <p>@{userInfo?.email?.split("@")[0]}</p>
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
          <p>로그아웃</p>
        </div>
      </div>
      <div className={styled.box__triangle}>
        <GoTriangleDown />
      </div>
    </div>
  );
}
