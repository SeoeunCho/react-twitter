import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "firebaseApp";
import useGetFbInfo from "hooks/useGetFbInfo";
import CircleLoader from "components/loader/CircleLoader";
import TweetListPage from "components/tweets/TweetListPage";

export default function ProfileLikeReplies({ userObj }: any) {
  const [myLikeReplies, setMyLikeReplies] = useState<any>([] || null);
  const [loading, setLoading] = useState<boolean>(false);
  const { reTweets } = useGetFbInfo();

  // 답글의 좋아요 정보 가져오기
  useEffect(() => {
    const repliesQuery = query(collection(db, "Replies"));

    const unsubscribe = onSnapshot(repliesQuery, (snapShot) => {
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

      setMyLikeReplies(sortArr);
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
          {myLikeReplies.length !== 0 ? (
            <div>
              {myLikeReplies.map((myTweet: any) => (
                <TweetListPage
                  key={myTweet.id}
                  isOwner={myTweet.creatorId === userObj.uid}
                  tweetObj={myTweet}
                  userObj={userObj}
                  reTweetsObj={reTweets}
                />
              ))}
            </div>
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>아직 마음에 들어한 답글이 없습니다</h2>
                <p>
                  좋아하는 답글의 하트를 눌러 표시 해보세요. 마음에 들어한
                  답글은 여기에 표시됩니다.
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
