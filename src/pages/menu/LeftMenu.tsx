import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaFeatherAlt, FaHashtag, FaTwitter } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FiHash, FiMoreHorizontal } from "react-icons/fi";
import { BsBell, BsBellFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "firebaseApp";
import { toast } from "react-toastify";

import TweetModal from "components/modal/TweetModal";
import LogoutModal from "components/modal/LogoutModal";
import useHandleOutsideClick from "hooks/useHandleOutsideClick";
import styled from "./LeftMenu.module.scss";

import useTranslation from "hooks/useTranslation";
import { setCurrentUser, setLoginToken } from "reducer/user";
import { useDispatch } from "react-redux";
import useGetFbInfo from "hooks/useGetFbInfo";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { UserObjProps } from "pages/Router";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function LeftMenu({ userObj }: UserObjProps) {
  const userLogoutRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<number>(1);
  const [size, setSize] = useState<number>(window.innerWidth);
  const [resize, setResize] = useState<boolean>(false);
  const [tweetModal, setTweetModal] = useState<boolean>(false);
  const [userLogout, setUserLogout] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { myInfo } = useGetFbInfo();

  const t = useTranslation();

  useHandleOutsideClick({
    ref: userLogoutRef,
    isModal: userLogout,
    setIsModal: setUserLogout,
  });

  const onSelect = (num: number) => {
    setSelected(num);
  };

  const toggleTweetModal = () => {
    setTweetModal((prev) => !prev);
  };

  const toggleLogoutModal = () => {
    setUserLogout((prev) => !prev);
  };

  const onLogOutClick = async () => {
    const confirm = window.confirm(t("CHECK_LOGOUT_TOAST"));
    if (confirm) {
      await signOut(auth);
      dispatch(setLoginToken("logout"));
      dispatch(
        setCurrentUser({
          photoURL: "",
          uid: "",
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
      toast.success(t("LOGOUT_TOAST"));
      navigate("/auth");
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelected(1);
    } else if (location.pathname.includes("explore")) {
      setSelected(2);
    } else if (location.pathname.includes("/notification")) {
      setSelected(3);
    } else if (location.pathname.includes("/bookmark")) {
      setSelected(4);
    } else if (location.pathname.includes("/profile")) {
      setSelected(5);
    }
  }, [location.pathname]);

  // 리사이징
  useEffect(() => {
    // 렌더 시
    if (size < 500) {
      setResize(true);
    } else if (size > 500) {
      setResize(false);
    }

    const Resize = () => {
      let innerSize = window.innerWidth;
      setSize(innerSize);
    };

    window.addEventListener("resize", Resize);
    return () => window.addEventListener("resize", Resize);
  }, [size, location.pathname, navigate, userObj?.email]);

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
                  <Link to="/explore/tweets/" onClick={() => onSelect(2)}>
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
                  <Link to="/notification/retweets" onClick={() => onSelect(3)}>
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
                  <Link to="/bookmark/tweets" onClick={() => onSelect(4)}>
                    <div className={styled.leftMenu__list}>
                      {selected === 4 ? (
                        <>
                          <IoBookmark />
                          <span>
                            <b>{t("MENU_BOOKMARK")}</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <IoBookmarkOutline />
                          <span>{t("MENU_BOOKMARK")}</span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/mytweets/${userObj?.email}`}
                    onClick={() => onSelect(5)}
                  >
                    <div className={styled.leftMenu__list}>
                      {selected === 5 ? (
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

                      {myInfo && resize && (
                        <div className={styled.userInfo__profileHidden}>
                          <div className={styled.userInfo__profile}>
                            <img
                              src={myInfo?.photoURL || PROFILE_DEFAULT_URL}
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
            <div className={styled.leftMenu__tweet} onClick={toggleTweetModal}>
              <div>
                <span>{t("BUTTON_TWEET")}</span>
                <FaFeatherAlt />
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }} ref={userLogoutRef}>
            {userLogout && (
              <LogoutModal creatorInfo={myInfo} onLogOutClick={onLogOutClick} />
            )}
            <section className={styled.leftMenu__user}>
              <div
                className={styled.leftMenu__userInfo}
                onClick={toggleLogoutModal}
              >
                <div className={styled.userInfo__profile}>
                  <img
                    src={
                      myInfo?.photoURL ? myInfo?.photoURL : PROFILE_DEFAULT_URL
                    }
                    alt="profileImg"
                    className={styled.profile__image}
                  />
                </div>
                <div className={styled.userInfo__name}>
                  <p>{myInfo?.displayName || myInfo?.email?.split("@")[0]}</p>
                  <p>@{myInfo?.email?.split("@")[0]}</p>
                </div>
                <div className={styled.userInfo__etc}>
                  <FiMoreHorizontal />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      {tweetModal && (
        <TweetModal
          userObj={userObj}
          tweetModal={tweetModal}
          setTweetModal={setTweetModal}
        />
      )}
    </>
  );
}
