import CircleLoader from "components/loader/CircleLoader";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "firebaseApp";
import useGetFbInfo from "hooks/useGetFbInfo";
import TweetListPage from "components/tweets/TweetListPage";
import { useEffect, useState } from "react";
import useTranslation from "hooks/useTranslation";

export default function ProfileReTweets({ userObj }: any) {
  const [ogTweets, setOgTweets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { reTweets } = useGetFbInfo();
  const t = useTranslation();

  // 원글의 리트윗 정보 가져오기
  useEffect(() => {
    const tweetsQuery = query(collection(db, "Tweets"));
    const unsubscribe = onSnapshot(tweetsQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = userArray
        .filter((arr: any) =>
          arr.reTweet.some((reTweet: any) => reTweet.email === userObj.email)
        )
        .sort((a: any, b: any) => b.reTweetAt - a.reTweetAt);
      setOgTweets(filter);
      setLoading(true);
    });

    return () => {
      unsubscribe();
    };
  }, [userObj.email]);

  return (
    <>
      {loading ? (
        <>
          {ogTweets.length ? (
            <div>
              {ogTweets.map((reTweet: any) => (
                <TweetListPage
                  isOwner={reTweet.creatorId === userObj.uid}
                  key={reTweet.id}
                  tweetObj={reTweet}
                  userObj={userObj}
                  reTweetsObj={reTweets}
                />
              ))}
            </div>
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>{t("NO_MY_RETWEET")}</h2>
                <p>{t("NO_MY_RETWEET_LIST")}</p>
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
