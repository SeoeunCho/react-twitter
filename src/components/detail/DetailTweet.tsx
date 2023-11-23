import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetailReplyForm from "./DetailReplyForm";
import DetailTweetParent from "./DetailTweetParent";
import DetailTweetReply from "./DetailTweetReply";
import { useSelector } from "react-redux";
import { db } from "firebaseApp";
import Header from "components/header";
import BarLoader from "components/loader/BarLoader";
// import { UserObjProps } from "pages/Router";

export default function DetailTweet({ userObj }: any) {
  const currentProgressBar = useSelector((state: any) => state.user.load);
  const currentNotModal = useSelector((state: any) => state.user.modal);
  const [tweets, setTweets] = useState<any>([]);
  const [reTweets, setReTweets] = useState<any>([]);
  const [replies, setReplies] = useState<any>("");
  const location = useLocation();
  const navigate = useNavigate();
  const uid = location.pathname.split("/")[2];

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

      setReTweets(reTweetArray);
    });

    return () => unsubscribe();
  }, [userObj.email]);

  // 원글 정보 가져오기
  useEffect(() => {
    const TweetsQuery = query(collection(db, "Tweets"));
    const unsubscribe = onSnapshot(TweetsQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const parentTweet = userArray.filter((reply) => reply.id === uid);

      if (!parentTweet[0]) {
        return navigate(-1);
      }

      setTweets(parentTweet[0]);
    });

    return () => unsubscribe();
  }, [navigate, uid]);

  // 답글 정보 가져오기
  useEffect(() => {
    const repliesQuery = query(
      collection(db, "Replies"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(repliesQuery, (snapShot) => {
      const replyArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const parentTweet = replyArray.filter(
        (reply: any) => reply.parent === uid
      );

      setReplies(parentTweet);
    });

    return () => unsubscribe();
  }, [uid]);

  return (
    <>
      {tweets && reTweets && replies && (
        <>
          <Header text={"TAB_TWEET"} />
          <DetailTweetParent
            tweetObj={tweets}
            userObj={userObj}
            reTweetsObj={reTweets}
          />
          {currentProgressBar?.load && currentNotModal.modal && <BarLoader />}
          <DetailReplyForm tweetObj={tweets} userObj={userObj} />
          {replies &&
            replies.map((reply: any) => (
              <DetailTweetReply
                key={reply.id}
                tweets={tweets}
                reTweetsObj={reTweets}
                tweetObj={reply}
                userObj={userObj}
              />
            ))}
        </>
      )}
    </>
  );
}
