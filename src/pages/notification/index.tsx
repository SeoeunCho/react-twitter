import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "firebaseApp";
import Header from "components/header";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import CircleLoader from "components/loader/CircleLoader";
import useGetFbInfo from "hooks/useGetFbInfo";
import NotificationReTweet from "components/notification/NotificationReTweet";
import NotificationReply from "components/notification/NotificationReply";
import NotificationFollow from "components/notification/NotificationFollow";
import useTranslation from "hooks/useTranslation";
import { UserObjProps } from "pages/Router";
import { ReTweetProps } from "pages/home";

export default function NotificationPage({ userObj }: UserObjProps) {
  const [selected, setSelected] = useState<number>(1);
  const [reTweets, setReTweets] = useState<any>([]);
  const [replies, setReplies] = useState([]);

  const [loading, setLoading] = useState({
    reTweets: false,
    replies: false,
  });
  
  const { myInfo, fbLoading } = useGetFbInfo();
  const location = useLocation();
  const t = useTranslation();
  const navigate = useNavigate();

  const goPage = (e: any) => {
    e.stopPropagation();
    if (selected === 1) {
      navigate("/notification/retweets");
    } else if (selected === 2) {
      navigate("/notification/replies");
    } else {
      navigate("/notification/followers");
    }
  };

  // 리트윗 가져오기
  useEffect(() => {
    const reTweetsQuery = query(
      collection(db, "ReTweets"),
      orderBy("reTweetAt", "desc")
    );

    const unsubscribe = onSnapshot(reTweetsQuery, (snapshot) => {
      const reTweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = reTweetArray.filter(
        (obj: any) =>
          obj.email !== userObj?.email &&
          (obj?.replyEmail ? obj?.replyEmail : obj?.parentEmail) ===
            userObj?.email
      );

      setReTweets(filter);
      setLoading((prev) => ({ ...prev, reTweets: true }));
    });

    return () => unsubscribe();
  }, [userObj?.email]);

  // 답글 가져오기
  useEffect(() => {
    const repliesQuery = query(
      collection(db, "Replies"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(repliesQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = userArray.filter(
        (id: any) => id.parentEmail === userObj?.email
      );
      const notMe: any = filter.filter(
        (obj: any) => obj.email !== userObj?.email
      );

      setReplies(notMe);
      setLoading((prev) => ({ ...prev, replies: true }));
    });

    return () => unsubscribe();
  }, [userObj?.email]);

  useEffect(() => {
    if (location.pathname.includes("/retweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/replies")) {
      setSelected(2);
    } else if (location.pathname.includes("/followers")) {
      setSelected(3);
    }
  }, [location.pathname]);

  return (
    <>
      <div className="menu_container">
        <Header text={"MENU_NOTI"} />
        <div className="main__container" style={{ height: "53px" }}>
          <nav className="categoryList">
            <TabMenuBtn
              num={1}
              selected={selected}
              url={"/notification/retweets/"}
              text={"TAB_RETWEET"}
            />
            <TabMenuBtn
              num={2}
              selected={selected}
              url={"/notification/replies"}
              text={"TAB_REPLY"}
            />
            <TabMenuBtn
              num={3}
              selected={selected}
              url={"/notification/followers"}
              text={"TAB_FOLLOWING_ING"}
            />
          </nav>
        </div>

        {selected === 1 && (
          <div onClick={goPage}>
            {loading.reTweets ? (
              <>
                {reTweets.length !== 0 ? (
                  reTweets?.map((reTweet: ReTweetProps) => (
                    <NotificationReTweet
                      key={reTweet.id}
                      reTweetsObj={reTweet}
                      loading={loading}
                      userObj={userObj}
                    />
                  ))
                ) : (
                  <div className="noInfoBox">
                    <div className="noInfo">
                      <h2>{t("NO_TWEET")}</h2>
                      <p>{t("NO_NOTIFICATION_RETWEET")}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <CircleLoader />
            )}
          </div>
        )}

        {selected === 2 && (
          <div onClick={goPage}>
            {loading.replies ? (
              <>
                {replies.length !== 0 ? (
                  replies?.map((reply: any) => (
                    <NotificationReply
                      key={reply.id}
                      userObj={userObj}
                      replyObj={reply}
                      loading={loading}
                    />
                  ))
                ) : (
                  <div className="noInfoBox">
                    <div className="noInfo">
                      <h2>{t("NO_TWEET")}</h2>
                      <p>{t("NO_NOTIFICATION_REPLY")}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <CircleLoader />
            )}
          </div>
        )}

        {selected === 3 && (
          <div onClick={goPage}>
            {fbLoading.myInfo ? (
              <>
                {myInfo && myInfo.follower.length !== 0 ? (
                  myInfo.follower
                    .sort((a: any, b: any) => b.followAt - a.followAt)
                    .map((follow: any, index: number) => (
                      <NotificationFollow
                        key={index}
                        userObj={userObj}
                        followObj={follow}
                        loading={loading}
                      />
                    ))
                ) : (
                  <div className="noInfoBox">
                    <div className="noInfo">
                      <h2>{t("NO_TWEET")}</h2>
                      <p>{t("NO_NOTIFICATION_FOLLOW")}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <CircleLoader />
            )}
          </div>
        )}
      </div>
    </>
  );
}
