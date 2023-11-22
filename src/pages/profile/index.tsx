import { languageState } from "atom";
import { useEffect, useState } from "react";
import styled from "./Profile.module.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BsCalendar3 } from "react-icons/bs";
import useGetFbInfo from "hooks/useGetFbInfo";
import { useTimeToString } from "hooks/useTimeToString";
import { useToggleFollow } from "hooks/useToggleFollow";
import { db } from "firebaseApp";
import Header from "components/header";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import ProfileMyTweets from "components/profile/ProfileMyTweets";
import ProfileReplies from "components/profile/ProfileReplies";
import ProfileReTweetBox from "components/profile/ProfileReTweetBox";
import ProfileLikeBox from "components/profile/ProfileLikeBox";
import BookmarkPage from "pages/bookmark";
import CircleLoader from "components/loader/CircleLoader";
import EditProfileModal from "components/modal/EditProfileModal";
import { useRecoilState } from "recoil";
import useTranslation from "hooks/useTranslation";

export default function Profile({ userObj }: any) {
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [myTweets, setMyTweets] = useState<any>([]);
  const [selected, setSelected] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { pathname } = useLocation();
  const userEmail = pathname.split("/")[3];
  const { myInfo } = useGetFbInfo();
  const { timeToString3 } = useTimeToString();
  const toggleFollow = useToggleFollow(myInfo);
  const [language, setLanguage] = useRecoilState(languageState);
  const t = useTranslation();
  const navigate = useNavigate();

  const onClickLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };

  const goPage = (e: any) => {
    e.stopPropagation();
    if (selected === 1) {
      navigate(`/profile/mytweets/${userEmail}`);
    } else if (selected === 2) {
      navigate(`/profile/replies/${userEmail}`);
    } else if (selected === 3) {
      navigate(`/profile/retweets/${userEmail}`);
      navigate(`/profile/retweetsreplies/${userEmail}`);
    } else if (selected === 4) {
      navigate(`/profile/liketweets/${userEmail}`);
      navigate(`/profile/likereplies/${userEmail}`);
    } else if (selected === 5){
      navigate(`/profile/bookmarktweets/${userEmail}`);
      navigate(`/profile/bookmarkreplies/${userEmail}`);
    }
  };

  useEffect(() => {
    const paths: any = {
      mytweets: 1,
      replies: 2,
      retweets: 3,
      retweetsreplies: 3,
      liketweets: 4,
      likereplies: 4,
      bookmarktweets: 5,
      bookmarkreplies: 5,
    };

    
    const selectedValue = paths[pathname.split("/")[2]];

    setSelected(selectedValue);
  }, [pathname, userObj.email]);

  // 필터링 방법 (본인이 작성한 것 확인)
  useEffect(() => {
    const tweetsQuery = query(
      collection(db, "Tweets"),
      where("email", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(tweetsQuery, (snapShot) => {
      const array = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyTweets(array);
    });

    return () => unsubscribe();
  }, [userEmail]);

  // 렌더링 시 실시간 정보 가져오고 이메일, 닉네임, 사진 바뀔 때마다 리렌더링(업데이트)
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", `${userEmail}`), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });

    return () => unsubscribe();
  }, [userEmail]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      <section className={styled.container}>
        <div className={styled.main__container}>
          <>
            {creatorInfo && (
              <>
                <Header
                  menu={"profile"}
                  text={creatorInfo?.displayName}
                  myTweets={myTweets}
                />
                {loading ? (
                  <>
                    <div className={styled.setUserInfo}>
                      <div className={styled.backImage}>
                        <img src={creatorInfo.bgURL} alt="배경사진" />
                      </div>

                      <div className={styled.profile}>
                        <div className={styled.profile__edit}>
                          <div className={styled.profile__image}>
                            <img
                              src={creatorInfo.photoURL}
                              alt="프로필 이미지"
                            />
                          </div>

                          {userObj.email === userEmail ? (
                            <>
                              <div
                                className={styled.profile__editBtn}
                                onClick={toggleEdit}
                              >
                                {t("BUTTON_EDIT_PROFILE")}
                              </div>
                              <div
                                className={`${styled.profile__editBtn} ${styled.profile__languageBtn}`}
                                onClick={onClickLanguage}
                              >
                                {language === "ko" ? "한국어" : "English"}
                              </div>
                            </>
                          ) : (
                            <>
                              {myInfo.following.some(
                                (follow: any) =>
                                  follow.email === creatorInfo.email
                              ) ? (
                                <div
                                  className={`${styled.profile__editBtn} ${styled.follow} `}
                                  onClick={() => toggleFollow(creatorInfo)}
                                >
                                  <p>{t("BUTTON_FOLLOWING")}</p>
                                </div>
                              ) : (
                                <div
                                  className={`${styled.profile__editBtn} ${styled.profile__followBtn} `}
                                  onClick={() => toggleFollow(creatorInfo)}
                                >
                                  <p>{t("BUTTON_FOLLOW")}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className={styled.profile__info}>
                          <div className={styled.userInfo}>
                            <p>{creatorInfo.displayName}</p>
                            <p>@{creatorInfo?.email?.split("@")[0]}</p>
                          </div>
                          <div className={styled.profile__desc}>
                            {creatorInfo.description === "" ? (
                              <p className={styled.notDesc}>
                                {t("PROFILE_ABOUT_ME_TEXT")}
                              </p>
                            ) : (
                              <p>{creatorInfo.description}</p>
                            )}
                          </div>
                          <div className={styled.profile__createdAt}>
                            <BsCalendar3 />
                            <p>
                              {t("PROFILE_JOIN_DATE")} :{" "}
                              {timeToString3(creatorInfo.createdAtId)}
                            </p>
                          </div>
                          <div className={styled.profile__followInfo}>
                            <p>
                              <b>{creatorInfo.following?.length}</b>{" "}
                              {t("BUTTON_FOLLOWING")}
                            </p>
                            <p>
                              <b>{creatorInfo.follower?.length}</b>{" "}
                              {t("BUTTON_FOLLOW")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <nav className={styled.categoryList}>
                      <TabMenuBtn
                        num={1}
                        selected={selected}
                        url={`/profile/mytweets/${userEmail}`}
                        text={"TAB_TWEET"}
                      />
                      <TabMenuBtn
                        num={2}
                        selected={selected}
                        url={`/profile/replies/${userEmail}`}
                        text={"TAB_REPLY"}
                      />
                      <TabMenuBtn
                        num={3}
                        selected={selected}
                        url={`/profile/retweets/${userEmail}`}
                        text={"TAB_RETWEET"}
                      />
                      <TabMenuBtn
                        num={4}
                        selected={selected}
                        url={`/profile/liketweets/${userEmail}`}
                        text={"TAB_LIKES"}
                      />
                      <TabMenuBtn
                          num={5}
                          selected={selected}
                          url={`/profile/bookmarktweets/${userEmail}`}
                          text={"TAB_BOOKMARK"}
                        />
                    </nav>

                    {selected === 1 && (
                      <div onClick={goPage}>
                        <ProfileMyTweets
                          myTweets={myTweets}
                          userObj={userObj}
                        />
                      </div>
                    )}

                    {selected === 2 && (
                      <div onClick={goPage}>
                        <ProfileReplies
                          userObj={userObj}
                          creatorInfo={creatorInfo}
                        />
                      </div>
                    )}

                    {selected === 3 && (
                      <div onClick={goPage}>
                        <ProfileReTweetBox
                          userObj={userObj}
                          creatorInfo={creatorInfo}
                        />
                      </div>
                    )}

                    {selected === 4 && (
                      <div onClick={goPage}>
                        <ProfileLikeBox userObj={userObj} />
                      </div>
                    )}

                    {selected === 5 && (
                      <div onClick={goPage}>
                        <BookmarkPage userObj={userObj} />
                      </div>
                    )}
                  </>
                ) : (
                  <CircleLoader />
                )}
              </>
            )}
          </>
        </div>
      </section>
      {isEditing && (
        <EditProfileModal
          creatorInfo={creatorInfo}
          setCreatorInfo={setCreatorInfo}
          isEditing={isEditing}
          toggleEdit={toggleEdit}
        />
      )}
    </>
  );
}
