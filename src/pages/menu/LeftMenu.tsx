import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaFeatherAlt, FaHashtag, FaTwitter } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FiHash, FiMoreHorizontal } from "react-icons/fi";
import { BsBell, BsBellFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { useContext, useEffect, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

import XweetModal from "components/modal/XweetModal";
import LogoutModal from "components/modal/LogoutModal";
import useLogoutModalClick from "hooks/useLogoutModalClick";
import styled from "./LeftMenu.module.scss";

import useTranslation from "hooks/useTranslation";
import AuthContext from "context/AuthContext";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function LeftMenu() {
  const [selected, setSelected] = useState<number>(1);
  const [size, setSize] = useState<number>(window.innerWidth);
  const [resize, setResize] = useState<boolean>(false);
  const [xweetModal, setXweetModal] = useState<boolean>(false);

  const { user } = useContext(AuthContext);
  const userLogoutRef = useRef<any>();
  const { userLogout, setUserLogout } = useLogoutModalClick(userLogoutRef);

  const location = useLocation();
  const t = useTranslation();

  const onSelect = (num: number) => {
    setSelected(num);
  };

  const onLogOutClick = async () => {
    const confirm = window.confirm(t("CHECK_LOGOUT_TOAST"));
    if (confirm) {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success(t("LOGOUT_TOAST"));
    }
  };

  const toggleXweetModal = () => {
    setXweetModal((prev) => !prev);
  };

  const toggleLogoutModal = () => {
    setUserLogout((prev) => !prev);
  };

  // 리사이징
  useEffect(() => {
    // 렌더 시
    if (size < 500) {
      setResize(true);
      if (location.pathname.includes("bookmark")) {
        // history.push("/profile/bookmarkxweets/" + userObj.email);
      }
    } else if (size > 500) {
      setResize(false);
      if (location.pathname.includes("bookmark")) {
        // history.push("/bookmark/xweets");
      }
    }

    const Resize = () => {
      let innerSize = window.innerWidth;
      setSize(innerSize);
    };

    window.addEventListener("resize", Resize);
    return () => window.addEventListener("resize", Resize);
  });

  useEffect(() => {
    if (location.pathname === "/") {
      setSelected(1);
    } else if (location.pathname.includes("/explore")) {
      setSelected(2);
    } else if (location.pathname.includes("/notice")) {
      setSelected(3);
    } else if (location.pathname.includes(`/profile/${user?.email}`)) {
      setSelected(4);
    } 
    // else if (location.pathname.includes("/bookmark")) {
    //   setSelected(5);
    // }
  }, [location.pathname, user?.email]);

  return (
    <>
      <section className={styled.container}>
        <div className={styled.wrapper}>
          <div className={styled.leftMenu__category}>
            <div className={styled.leftMenu__logobox}>
              <div className={styled.leftMenu__logo}>
                <Link to="/">
                  <FaTwitter />
                </Link>
              </div>
            </div>
            <nav className={styled.leftMenu__container}>
              <ul>
                <li>
                  <Link to="/" onClick={() => onSelect(1)}>
                    <div className={styled.leftMenu__list}>
                      {selected === 1 ? (
                        <>
                          <AiFillHome />
                          <span>
                            <b>{t("MENU_HOME")}</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <AiOutlineHome />
                          <span>{t("MENU_HOME")}</span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/explore" onClick={() => onSelect(2)}>
                    <div className={styled.leftMenu__list}>
                      {selected === 2 ? (
                        <>
                          <FaHashtag />
                          <span>
                            <b>{t("MENU_EXPLORE")}</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <FiHash />
                          <span>{t("MENU_EXPLORE")}</span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/notifications" onClick={() => onSelect(3)}>
                    <div className={styled.leftMenu__list}>
                      {selected === 3 ? (
                        <>
                          <BsBellFill />
                          <span>
                            <b>{t("MENU_NOTI")}</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <BsBell />
                          <span>{t("MENU_NOTI")}</span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${user?.email}`}
                    onClick={() => onSelect(4)}
                  >
                    <div className={styled.leftMenu__list}>
                      {selected === 4 ? (
                        <>
                          <BsPersonFill />
                          <span>
                            <b>{t("MENU_PROFILE")}</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <BsPerson />
                          <span>{t("MENU_PROFILE")}</span>
                        </>
                      )}

                      {user && resize && (
                        <div className={styled.userInfo__profileHidden}>
                          <div className={styled.userInfo__profile}>
                            <img
                              src={user?.photoURL || PROFILE_DEFAULT_URL}
                              alt="profileImg"
                              className={styled.profile__image}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className={styled.leftMenu__xweet} onClick={toggleXweetModal}>
              <div>
                <span>{t("BUTTON_TWEET")}</span>
                <FaFeatherAlt />
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }} ref={userLogoutRef}>
            {userLogout && (
              <LogoutModal userInfo={user} onLogOutClick={onLogOutClick} />
            )}
            <section className={styled.leftMenu__user}>
              <div
                className={styled.leftMenu__userInfo}
                onClick={toggleLogoutModal}
              >
                <div className={styled.userInfo__profile}>
                  <img
                    src={user?.photoURL ? user?.photoURL : PROFILE_DEFAULT_URL}
                    alt="profileImg"
                    className={styled.profile__image}
                  />
                </div>
                <div className={styled.userInfo__name}>
                  <p>{user?.displayName}</p>
                  <p>@{user?.email?.split("@")[0]}</p>
                </div>
                <div className={styled.userInfo__etc}>
                  <FiMoreHorizontal />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      {xweetModal && (
        <XweetModal xweetModal={xweetModal} setXweetModal={setXweetModal} />
      )}
    </>
  );
}
