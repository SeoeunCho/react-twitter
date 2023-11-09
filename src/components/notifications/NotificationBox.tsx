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
    const ref = doc(db, "notifications", notification.id);
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
      <div className={styled.xweet}>
        <div className={styled.xweet__container}>
          <Link to={`/profile`} className={styled.xweet__profile} ref={imgRef}>
            <img
              src={user?.photoURL || PROFILE_DEFAULT_URL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </Link>
          {/* <Link
            className={styled.xweet__contents}
            to={
              location.pathname.includes("followers")
                ? `/profile/myxweets/${notification?.email}`
                : `/xweet/${notification?.parent}`
            }
          > */}
          <div
            className={styled.reXweetBox}
            onClick={() => onClickNotification(notification?.url)}
          >
            <p>
              <span className={styled.reXweet__name}>
                {notification?.content}
              </span>
              {/* <span ref={nameRef}>
                  @{(user?.email || notification?.email)?.split("@")[0]}
                </span>
                님이{" "}
                {location.pathname.includes("rexweets") && (
                  <span className={styled.reXweet__name}>
                    "{noticeUser?.text ? noticeUser?.text : xweets?.text}"
                  </span>
                )}
                {location.pathname.includes("replies") && (
                  <span className={styled.reXweet__name}>"{xweets?.text}"</span>
                )}
                
                {location.pathname.includes("followers") && null}
                {text} */}
            </p>
          </div>
          <div style={{ marginLeft: "auto" }} className={styled.reXweet__time}>
            {/* {location.pathname.includes("rexweets") && (
                <p>{timeToString(noticeUser?.reXweetAt)}</p>
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
