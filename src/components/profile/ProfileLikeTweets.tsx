import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import useGetFbInfo from "hooks/useGetFbInfo";
import { db } from "firebaseApp";
import TweetListPage from "components/tweets/TweetListPage";
import CircleLoader from "components/loader/CircleLoader";
import useTranslation from "hooks/useTranslation";

export default function ProfileLikeTweets({ userObj }: any) {
  const [myLikeTweets, setMyLikeTweets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { reTweets } = useGetFbInfo();
  const t = useTranslation();

  // 원글의 좋아요 정보 가져오기
  useEffect(() => {
    const tweetsQuery = query(collection(db, "Tweets"));

    const unsubscribe = onSnapshot(tweetsQuery, (snapShot) => {
      const array = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filterArr = array.filter((arr: any) =>
        arr.like.some((like: any) => like.email === userObj.email)
      );

      const sortArr = filterArr
        .map((arr: any) => {
          const filter = arr.like.filter(
            (like: any) => like?.email === userObj.email
          );
          return { id: arr.id, likeAt: filter[0].likeAt, ...arr };
        })
        .sort((a, b) => b.likeAt - a.likeAt);

      setMyLikeTweets(sortArr);
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
          {myLikeTweets.length !== 0 ? (
            <div>
              {myLikeTweets.map((myTweet: any) => (
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
                <h2>{t("NO_LIKE_TWEET")}</h2>
                <p>{t("NO_LIKE_TWEET_LIST")}</p>
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
