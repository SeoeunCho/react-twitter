import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notifications";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "context/AuthContext";
import styled from "./Notification.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { useTimeToString } from "hooks/useTimeToString";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function NotificationBox({
  notification,
  tab,
}: {
  notification: NotificationProps;
  tab: string;
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const onClickNotification = async (url: string) => {
    // isRead 업데이트
    const ref = doc(db, "Notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });

    // url로 이동
    navigate(url);
  };

  const imgRef = useRef<any>();
  const nameRef = useRef<any>();
  // const location = useLocation();
  const [followTime, setFollowTime] = useState([]);

  // 팔로우 시간 정보 가져오기
  // useEffect(() => {
  //   if (creatorInfo?.following) {
  //     creatorInfo?.following.map((follow) => setFollowTime(follow.followAt));
  //   }
  // }, [creatorInfo?.following]);

  const { timeToString } = useTimeToString();

  return (
    // <div key={notification.id} className={styled.notification}>
    //   <div onClick={() => onClickNotification(notification?.url)}>
    //     <div className={styled.notification__flex}>
    //       <div className={styled.notification__createdAt}>
    //         {notification?.createdAt}
    //       </div>
    //       {notification?.isRead === false && (
    //         <div className={styled.notification__unread}></div>
    //       )}
    //     </div>
    //     <div className="notification__content">{notification.content}</div>
    //   </div>
    // </div>

    <>
      <div className={styled.tweet}>
        <div className={styled.tweet__container}>
          <Link
            to={`/profile/${notification?.email}`}
            className={styled.tweet__profile}
            ref={imgRef}
          >
            <img
              src={user?.photoURL || PROFILE_DEFAULT_URL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </Link>
          {/* <Link
            className={styled.tweet__contents}
            to={
              location.pathname.includes("followers")
                ? `/profile/mytweets/${notification?.email}`
                : `/tweet/${notification?.parent}`
            }
          > */}
          <div
            className={styled.reTweetBox}
            onClick={() => onClickNotification(notification?.url)}
          >
            <p>
              <span ref={nameRef}>
                @{notification?.displayName?.split("@")[0]}
              </span>
              님이
              {tab === "reply" && (
                <span className={styled.reTweet__name}>
                  &nbsp;"{notification?.content}"
                </span>
              )}
              {tab === "Following"
                ? " 회원님을 팔로우 했습니다."
                : " 글에 답글을 달았습니다."}
            </p>
          </div>
          <div style={{ marginLeft: "auto" }} className={styled.reTweet__time}>
            {/* {location.pathname.includes("retweets") && (
                <p>{timeToString(noticeUser?.reTweetAt)}</p>
              )}
              {location.pathname.includes("replies") && (
                <p>{timeToString(noticeUser?.createdAt)}</p>
              )}
              {location.pathname.includes("followers") && (
                <p>{timeToString(followTime)}</p>
              )} */}
          </div>
          {/* </Link> */}
        </div>
      </div>
    </>
  );
}
