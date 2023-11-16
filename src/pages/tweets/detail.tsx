import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Loader from "components/loader/Loader";
import TweetBox from "components/tweets/TweetBox";
import { TweetProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "firebaseApp";
import ReplyForm from "components/reply/ReplyForm";
import ReplyBox, { ReplyProps } from "components/reply/ReplyBox";
import Header from "components/header";

export default function TweetDetail() {
  const params = useParams();
  const [tweet, setTweet] = useState<TweetProps | null>(null);
  const [findReplies, setFindReplies] = useState<ReplyProps[] | any>(null);
  const [replies, setReplies] = useState<ReplyProps[] | any>(null);

  const getTweet = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "Tweets", params.id);
      onSnapshot(docRef, (doc) => {
        setTweet({ ...(doc?.data() as TweetProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {{/* <Route
                  path="/tweets"
                  element={<TweetListPage userObj={userObj} />}
                /> */}
                {/* <Route
                  path="/tweets/new"
                  element={<TweetNew userObj={userObj} />}
                /> */}
                {/* <Route
                  path="/tweets/edit/:id"
                  element={<TweetEdit userObj={userObj} />}
                /> */}
    if (params.id) getTweet();
  }, [getTweet, params.id]);

  useEffect(() => {
    if (tweet) {
      let repliesRef = collection(db, "Replies");
      let repliesQuery = query(repliesRef, orderBy("createdAt", "desc"));

      onSnapshot(repliesQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setReplies(dataObj as ReplyProps[]);
      });
      setFindReplies(
        replies?.filter((reply: ReplyProps) => tweet.id === reply.tweetId)
      );
    }
  }, [tweet, replies]);

  return (
    <div className="tweet">
      <Header menu={"detail"} text={"TAB_MY"} />
      {tweet ? (
        <>
          <TweetBox
            tweet={tweet}
            reply={findReplies}
            detailId={tweet?.id}
            tweetType={"tweet"}
            detailTweet={true}
          />
          <ReplyForm tweet={tweet} replyModal={false} setReplyModal={false} />

          <ReplyBox
            tweet={tweet}
            reply={findReplies}
            detailId={findReplies?.id}
            tweetType={"reply"}
            detailTweet={false}
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
