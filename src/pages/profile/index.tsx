import { languageState } from "atom";
import { useEffect, useState } from "react";
import styled from "./Profile.module.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { Route, useNavigate, useLocation, Routes } from "react-router-dom";
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

export default function Profile({ userObj }: any) {
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [myTweets, setMyTweets] = useState<any>([]);
  const [selected, setSelected] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [size, setSize] = useState(window.innerWidth);
  const [resize, setResize] = useState(false);
  const { pathname } = useLocation();
  const userEmail = pathname.split("/")[3];
  const { myInfo } = useGetFbInfo();
  const { timeToString } = useTimeToString();
  const toggleFollow = useToggleFollow(myInfo);
  const [language, setLanguage] = useRecoilState(languageState);

  const onClickLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };

  useEffect(() => {
    const paths: any = {
      mytweets: 1,
      replies: 2,
      retweets: 3,
      like: 4,
      bookmark: 5,
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
    const unsubscribe = onSnapshot(doc(db, "Users", userEmail), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });

    return () => unsubscribe();
  }, [userEmail]);

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
  }, [size]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  console.log("creatorInfo", creatorInfo?.displayName);

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
                          <button
                            type="button"
                            className="profile__btn--language"
                            onClick={onClickLanguage}
                          >
                            {language === "ko" ? "한국어" : "English"}
                          </button>

                          {userObj.email === userEmail ? (
                            <div
                              className={styled.profile__editBtn}
                              onClick={toggleEdit}
                            >
                              프로필 수정
                            </div>
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
                                  <p>팔로잉</p>
                                </div>
                              ) : (
                                <div
                                  className={`${styled.profile__editBtn} ${styled.profile__followBtn} `}
                                  onClick={() => toggleFollow(creatorInfo)}
                                >
                                  <p>팔로우</p>
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
                                소개글이 없습니다
                              </p>
                            ) : (
                              <p>{creatorInfo.description}</p>
                            )}
                          </div>
                          <div className={styled.profile__createdAt}>
                            <BsCalendar3 />
                            <p>
                              가입일 : {timeToString(creatorInfo.createdAtId)}
                            </p>
                          </div>
                          <div className={styled.profile__followInfo}>
                            <p>
                              <b>{creatorInfo.following?.length}</b> 팔로잉
                            </p>
                            <p>
                              <b>{creatorInfo.follower?.length}</b> 팔로워
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
                        text={"TAB_MY"}
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
                      {resize && userObj.email === userEmail && (
                        <TabMenuBtn
                          num={5}
                          selected={selected}
                          url={`/profile/bookmarktweets/${userEmail}`}
                          text={"TAB_BOOKMARK"}
                        />
                      )}
                    </nav>

                    <Routes>
                      <Route
                        path={`/profile/mytweets/${userEmail}`}
                        element={
                          <ProfileMyTweets
                            myTweets={myTweets}
                            userObj={userObj}
                          />
                        }
                      />

                      <Route
                        path={`/profile/replies/${userEmail}`}
                        element={
                          <ProfileReplies
                            userObj={userObj}
                            creatorInfo={creatorInfo}
                          />
                        }
                      />

                      <Route
                        path={`/profile/retweets/${userEmail}`}
                        element={
                          <ProfileReTweetBox
                            userObj={userObj}
                            creatorInfo={creatorInfo}
                          />
                        }
                      />

                      <Route
                        path={`/profile/retweetsreplies/${userEmail}`}
                        element={
                          <ProfileReTweetBox
                            userObj={userObj}
                            creatorInfo={creatorInfo}
                          />
                        }
                      />

                      <Route
                        path={`/profile/liketweets/${userEmail}`}
                        element={<ProfileLikeBox userObj={userObj} />}
                      />

                      <Route
                        path={`/profile/likereplies/${userEmail}`}
                        element={<ProfileLikeBox userObj={userObj} />}
                      />

                      {userObj.email === userEmail && (
                        <Route
                          path={`/profile/bookmarktweets/${userEmail}`}
                          element={<BookmarkPage userObj={userObj} />}
                        />
                      )}

                      {userObj.email === userEmail && (
                        <Route
                          path={`/profile/bookmarkreplies/${userEmail}`}
                          element={<BookmarkPage userObj={userObj} />}
                        />
                      )}
                    </Routes>
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
