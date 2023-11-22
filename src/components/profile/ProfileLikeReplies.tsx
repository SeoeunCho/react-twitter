import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "firebaseApp";
import useGetFbInfo from "hooks/useGetFbInfo";
import CircleLoader from "components/loader/CircleLoader";
import TweetListPage from "components/tweets/TweetListPage";
import useTranslation from "hooks/useTranslation";

export default function ProfileLikeReplies({ userObj }: any) {
  const [myLikeReplies, setMyLikeReplies] = useState<any>([] || null);
  const [loading, setLoading] = useState<boolean>(false);
  const { reTweets } = useGetFbInfo();
  const t = useTranslation();

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
                <h2>{t("NO_LIKE_REPLY")}</h2>
                <p>{t("NO_LIKE_REPLY_LIST")}</p>
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
