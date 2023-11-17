import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import CircleLoader from "../loader/CircleLoader";
import useGetFbInfo from "../../hooks/useGetFbInfo";
import TweetListPage from "components/tweets/TweetListPage";
import { db } from "firebaseApp";

export default function ExploreTweets({ userObj }: any) {
  const [tweets, setTweets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { reTweets } = useGetFbInfo();

  useEffect(() => {
    const tweetsQuery = query(
      collection(db, "Tweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("tweetArray", tweetArray);
      setTweets(tweetArray);
      setLoading(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading ? (
        <>
          {tweets.length !== 0 && (
            <div style={{ marginTop: "53px" }}>
              {tweets.map((tweet: any) => (
                <TweetListPage
                  key={tweet.id}
                  tweetObj={tweet}
                  reTweetsObj={reTweets}
                  userObj={userObj}
                  isOwner={tweet.email === userObj.email}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <CircleLoader />
      )}
    </>
  );
}
