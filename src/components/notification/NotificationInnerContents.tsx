import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTimeToString } from "../../hooks/useTimeToString";
import styled from "./NotificationInnerContents.module.scss";

export default function NotificationInnerContents({
  notificationUser,
  creatorInfo,
  text,
  tweets,
}: any) {
  const imgRef = useRef<any>();
  const nameRef = useRef<any>();
  const location = useLocation();
  const [followTime, setFollowTime] = useState<any>([]);

  // 팔로우 시간 정보 가져오기
  useEffect(() => {
    if (creatorInfo?.following) {
      creatorInfo?.following.map((follow: any) => setFollowTime(follow.followAt));
    }
  }, [creatorInfo?.following]);

  const { timeToString } = useTimeToString();

  return (
    <>
      <div className={styled.tweet}>
        <div className={styled.tweet__container}>
          <Link
            to={`/profile/mytweets/${notificationUser?.email}`}
            className={styled.tweet__profile}
            ref={imgRef}
          >
            <img
              src={creatorInfo?.photoURL || notificationUser?.photoURL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </Link>
          <Link
            className={styled.tweet__contents}
            to={
              location.pathname.includes("followers")
                ? `/profile/mytweets/${notificationUser?.email}`
                : `/tweet/${notificationUser?.parent}`
            }
          >
            <div className={styled.reTweetBox}>
              <p>
                <span ref={nameRef}>
                  @{(notificationUser?.email || creatorInfo.email)?.split("@")[0]}
                </span>
                님이{" "}
                {location.pathname.includes("retweets") && (
                  <span className={styled.reTweet__name}>
                    "{notificationUser?.text ? notificationUser?.text : tweets?.text}"
                  </span>
                )}
                {location.pathname.includes("replies") && (
                  <span className={styled.reTweet__name}>"{tweets?.text}"</span>
                )}
                {location.pathname.includes("followers") && null}
                {text}
              </p>
            </div>
            <div
              style={{ marginLeft: "auto" }}
              className={styled.reTweet__time}
            >
              {location.pathname.includes("retweets") && (
                <p>{timeToString(notificationUser?.reTweetAt)}</p>
              )}
              {location.pathname.includes("replies") && (
                <p>{timeToString(notificationUser?.createdAt)}</p>
              )}
              {location.pathname.includes("followers") && (
                <p>{timeToString(followTime)}</p>
              )}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
