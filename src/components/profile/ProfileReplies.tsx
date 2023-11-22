import CircleLoader from "components/loader/CircleLoader";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import useGetFbInfo from "hooks/useGetFbInfo";
import TweetListPage from "components/tweets/TweetListPage";
import { useEffect, useState } from "react";
import useTranslation from "hooks/useTranslation";

export default function ProfileReplies({ userObj, creatorInfo }: any) {
  const [filterReplies, setFilterReplies] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { reTweets } = useGetFbInfo();
  const t = useTranslation();

  // 답글 가져오기
  useEffect(() => {
    const repliesQuery = query(
      collection(db, "Replies"),
      where("email", "==", creatorInfo.email)
    );
    const unsubscribe = onSnapshot(repliesQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortArr = userArray.sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      );
      setFilterReplies(sortArr);
      setLoading(true);
    });

    return () => {
      unsubscribe();
    };
  }, [creatorInfo.email]);

  return (
    <>
      {loading ? (
        <>
          {filterReplies.length ? (
            <div>
              {filterReplies.map((myTweet: any) => (
                <TweetListPage
                  isOwner={myTweet.creatorId === userObj.uid}
                  key={myTweet.id}
                  tweetObj={myTweet}
                  userObj={userObj}
                  reTweetsObj={reTweets}
                />
              ))}
            </div>
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>{t("NO_MY_REPLY")}</h2>
                <p>{t("NO_MY_REPLY_LIST")}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <CircleLoader />
      )}
    </>
  );
}
