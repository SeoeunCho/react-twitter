import TweetBox from "components/tweets/TweetBox";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { useTimeToString } from "hooks/useTimeToString";
import useToggleRepliesRetweet from "hooks/useToggleRepliesRetweet";
import { useEffect, useState } from "react";

const DetailTweetReply = ({ tweetObj, userObj, reTweetsObj }: any) => {
  // tweets = 원글 계정 정보
  // tweetObj = 답글 계정 정보
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  //  map 처리 된 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", tweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
    return () => unsubscribe();
  }, [tweetObj]);

  const { reTweet, setReTweet, toggleReTweet } = useToggleRepliesRetweet(
    reTweetsObj,
    tweetObj,
    userObj
  );

  const { timeToString2 } = useTimeToString();

  return (
    <>
      {loading && (
        <>
          <TweetBox
            loading={loading}
            userObj={userObj}
            tweetObj={tweetObj}
            creatorInfo={creatorInfo}
            reTweetsObj={reTweetsObj}
            reTweet={reTweet}
            setReTweet={setReTweet}
            toggleReTweet={toggleReTweet}
            isOwner={userObj.email === tweetObj.email}
            timeToString={timeToString2}
          />
        </>
      )}
    </>
  );
};

export default DetailTweetReply;
