import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTimeToString } from "../../hooks/useTimeToString";
import styled from "./NotificationInnerContents.module.scss";
import useTranslation from "hooks/useTranslation";

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
  const t = useTranslation();
  const navigate = useNavigate();

  const truncate = (content: string) => {
    return content?.length > 13 ? content?.substring(0, 13) + "..." : content;
  };

  const goProfilePage = (e: any) => {
    e.stopPropagation();
    navigate(`/profile/mytweets/${notificationUser?.email}`);
  };

  const goPage = (e: any) => {
    e.stopPropagation();

    location.pathname.includes("followers")
      ? navigate(`/profile/mytweets/${notificationUser?.email}`)
      : navigate(`/tweet/${notificationUser?.parent}`);
  };

  // 팔로우 시간 정보 가져오기
  useEffect(() => {
    if (creatorInfo?.following) {
      creatorInfo?.following.map((follow: any) =>
        setFollowTime(follow.followAt)
      );
    }
  }, [creatorInfo?.following]);

  const { timeToString } = useTimeToString();

  return (
    <>
      <div className={styled.tweet}>
        <div className={styled.tweet__container}>
          <div
            onClick={goProfilePage}
            className={styled.tweet__profile}
            ref={imgRef}
          >
            <img
              src={creatorInfo?.photoURL || notificationUser?.photoURL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <div className={styled.tweet__contents} onClick={goPage}>
            <div className={styled.reTweetBox}>
              <p>
                <span ref={nameRef}>
                  @
                  {
                    (notificationUser?.email || creatorInfo.email)?.split(
                      "@"
                    )[0]
                  }
                </span>
                {location.pathname.includes("retweets") && (
                  <>
                    {t("NOTIFICATION_FROM_RETWEET")}{" "}
                    <span className={styled.reTweet__name}>
                      "
                      {notificationUser?.text
                        ? truncate(notificationUser?.text)
                        : truncate(tweets?.text)}
                      "
                    </span>
                  </>
                )}
                {location.pathname.includes("replies") && (
                  <>
                    {t("NOTIFICATION_FROM_REPLY")}{" "}
                    <span className={styled.reTweet__name}>
                      "{truncate(tweets?.text)}"
                    </span>
                  </>
                )}
                {location.pathname.includes("followers") && (
                  <>{t("NOTIFICATION_FROM_REPLY")} </>
                )}
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
          </div>
        </div>
      </div>
    </>
  );
}
