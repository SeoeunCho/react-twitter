import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import useGetFbInfo from "hooks/useGetFbInfo";
import { db } from "firebaseApp";
import TweetListPage from "components/tweets/TweetListPage";
import CircleLoader from "components/loader/CircleLoader";

export default function ProfileLikeTweets({ userObj }: any) {
  const [myLikeTweets, setMyLikeTweets] = useState<any>([]);
  const { reTweets } = useGetFbInfo();
  const [loading, setLoading] = useState(false);

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
                <h2>아직 마음에 들어한 트윗이 없습니다</h2>
                <p>
                  좋아하는 트윗의 하트를 눌러 표시 해보세요. 마음에 들어한
                  트윗은 여기에 표시됩니다.
                </p>
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
