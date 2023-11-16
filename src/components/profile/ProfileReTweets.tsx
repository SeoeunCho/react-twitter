import CircleLoader from "components/loader/CircleLoader";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "firebaseApp";
import useGetFbInfo from "hooks/useGetFbInfo";
import TweetListPage from "components/tweets/TweetListPage";
import { useEffect, useState } from "react";

export default function ProfileReTweets({ userObj }: any) {
  const [ogTweets, setOgTweets] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { reTweets } = useGetFbInfo();

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
                <h2>아직 리트윗한 트윗이 없습니다</h2>
                <p>좋은 트윗을 알리고 싶다면 리트윗을 눌러 표시를 해보세요.</p>
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
