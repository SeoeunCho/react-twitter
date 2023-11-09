import { Link, useNavigate } from "react-router-dom";
import styled from "./Menu.module.scss";
import { FaFeatherAlt, FaHashtag, FaTwitter } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FiHash, FiMoreHorizontal } from "react-icons/fi";
import { BsBell, BsBellFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { useContext, useState } from "react";
import useTranslation from "hooks/useTranslation";
import AuthContext from "context/AuthContext";
import XweetModal from "components/modal/XweetModal";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function LeftMenu() {
  const [selected, setSelected] = useState<number>(1);
  const [xweetModal, setXweetModal] = useState<boolean>(false);

  const { user } = useContext(AuthContext);
  // const navigate = useNavigate();
  const t = useTranslation();

  const onSelect = (num: number) => {
    setSelected(num);
  };

  const toggleXweetModal = () => {
    setXweetModal((prev) => !prev);
  };

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
                  <Link to="/search" onClick={() => onSelect(2)}>
                    <div className={styled.leftMenu__list}>
                      {selected === 2 ? (
                        <>
                          <FaHashtag />
                          <span>
                            <b>{t("MENU_SEARCH")}</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <FiHash />
                          <span>{t("MENU_SEARCH")}</span>
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
                  <Link to={`/profile/${user?.email}`} onClick={() => onSelect(4)}>
                    <div className={styled.leftMenu__list}>
                      {selected === 4 ? (
                        <>
                          <BsPersonFill />
                          <span>
                            <b>프로필</b>
                          </span>
                        </>
                      ) : (
                        <>
                          <BsPerson />
                          <span>프로필</span>
                        </>
                      )}

                      {/* {user && (
                        <div className={styled.userInfo__profileHidden}>
                          <div className={styled.userInfo__profile}>
                            <img
                              src={user?.photoURL || PROFILE_DEFAULT_URL}
                              alt="profileImg"
                              className={styled.profile__image}
                            />
                          </div>
                        </div>
                      )} */}
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className={styled.leftMenu__xweet} onClick={toggleXweetModal}>
              <div>
                <span>트윗하기</span>
                <FaFeatherAlt />
              </div>
            </div>
          </div>
        </div>
        {/* <div style={{ position: "relative" }} ref={userEtcRef}>
            {userEtc && (
              <UserEtcBtn onLogOutClick={onLogOutClick} creatorInfo={myInfo} />
            )}
            <section className={styled.leftMenu__user}>
              <div className={styled.leftMenu__userInfo} onClick={toggleUserEtc}>
                <div className={styled.userInfo__profile}>
                  <img
                    src={myInfo?.photoURL ? myInfo?.photoURL : noneProfile}
                    alt="profileImg"
                    className={styled.profile__image}
                  />
                </div>
                <div className={styled.userInfo__name}>
                  <p>{myInfo?.displayName}</p>
                  <p>@{userObj.email.split("@")[0]}</p>
                </div>
                <div className={styled.userInfo__etc}>
                  <FiMoreHorizontal />
                </div>
              </div>
            </section>
          </div> */}
      </section>
      {xweetModal && (
        <XweetModal
          xweetModal={xweetModal}
          setXweetModal={setXweetModal}
          toggleXweetModal={toggleXweetModal}
        />
      )}
    </>
  );
}
