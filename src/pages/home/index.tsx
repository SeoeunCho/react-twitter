import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setNotModal } from "reducer/user";
import { db } from "firebaseApp";
import Header from "components/header";
import TweetForm from "components/tweets/TweetForm";
import TweetListPage from "components/tweets/TweetListPage";
import CircleLoader from "components/loader/CircleLoader";
import useTranslation from "hooks/useTranslation";
import { UserObjProps } from "pages/Router";

export interface ActionProps {
  email: string;
  likeAt?: number;
  reTweetAt?: number;
}

export interface TweetProps {
  id: string;
  attachmentUrl?: string;
  createdAt: number;
  creatorId?: string;
  email: string;
  hashTags?: string[];
  imgUid?: string;
  like?: ActionProps[];
  reTweet?: ActionProps[];
  replyId?: string[];
  text: string;
}

export interface ReTweetProps {
  id: string;
  creatorId: string;
  email: string;
  like?: ActionProps[];
  parent: string;
  parentEmail: string;
  reTweetAt: number;
  reTweetEmail: string;
  replyId: string;
  text: string;
}

export interface RepliesProps {
  id: string;
  attachmentUrl?: string;
  createdAt: number;
  creatorId?: string;
  email: string;
  hashTags?: string[];
  imgUid?: string;
  isReply: boolean;
  like?: ActionProps[];
  parent: string;
  parentEmail: string;
  reTweet?: ActionProps[];
  reTweetAt?: ActionProps[];
  replyId?: string[];
  text: string;
}

export default function HomePage({ userObj }: UserObjProps) {
  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [reTweets, setReTweets] = useState<ReTweetProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const t = useTranslation();
  useEffect(() => {
    dispatch(setNotModal({ modal: true }));
  }, [dispatch]);

  useEffect(() => {
    const tweetsRef = collection(db, "Tweets");
    const tweetsQuery = query(tweetsRef, orderBy("createdAt", "desc")); // asc(오름차순), desc(내림차순)

    // Tweets 컬렉션 출력
    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      // map 사용 시 - 더 적게 리렌더링 하기 때문에 map 사용이 나음
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTweets(tweetArray as TweetProps[]);

      if (tweetArray) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [tweets]);

  // 리트윗 정보
  useEffect(() => {
    const reTweetsQuery = query(collection(db, "ReTweets"));

    const unsubscribe = onSnapshot(reTweetsQuery, (snapShot) => {
      const reTweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReTweets(reTweetArray as ReTweetProps[]);
    });

    return () => unsubscribe();
  }, [reTweets]);

  return (
    <>
      <div>
        <div>
          <Header menu={"home"} text={"MENU_HOME"} />
          {loading && <TweetForm userObj={userObj} />}
          <ul>
            {tweets?.length > 0 ? (
              tweets?.map((tweet: TweetProps) => (
                <TweetListPage
                  key={tweet.id}
                  tweetObj={tweet}
                  reTweetsObj={reTweets}
                  userObj={userObj}
                  isOwner={tweet.creatorId === userObj?.uid}
                />
              ))
            ) : (
              <div className="noInfoBox">
                <div className="noInfo">
                  <h2>{t("NO_TWEET")}</h2>
                  <p>{t("NO_TWEET_LIST")}</p>
                </div>
              </div>
            )}
            {!loading && <CircleLoader />}
          </ul>
        </div>
      </div>
    </>
  );
}
