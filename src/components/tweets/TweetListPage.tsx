import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "firebaseApp";
import TweetBox from "./TweetBox";
// import { TweetProps } from "pages/home";
// import { UserProps } from "Router";
import { useToggleRepliesRetweet } from "hooks/useToggleRepliesRetweet";

// export interface TweetCompProps {
//   isOwner?: boolean;
//   tweetObj: TweetProps;
//   userObj: UserProps;
//   reTweetsObj: any;
// }

export interface TweetCompProps {
  isOwner?: boolean;
  tweetObj?: any;
  userObj: any;
  reTweetsObj?: any;
}

export default function TweetListPage({
  isOwner,
  userObj,
  tweetObj,
  reTweetsObj,
}: any) {
  const [creatorInfo, setCreatorInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { reTweet, setReTweet, toggleReTweet } = useToggleRepliesRetweet({
    userObj,
    tweetObj,
    reTweetsObj,
  });

  //  map 처리 된 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Users", tweetObj.email),
      (doc: any) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      }
    );
    return () => unsubscribe();
  }, [tweetObj]);

  return (
    <>
      {loading && (
        <TweetBox
          loading={loading}
          userObj={userObj}
          tweetObj={tweetObj}
          creatorInfo={creatorInfo}
          reTweetsObj={reTweetsObj}
          reTweet={reTweet}
          setReTweet={setReTweet}
          toggleReTweet={toggleReTweet}
          isOwner={isOwner}
        />
      )}
    </>
  );
}
