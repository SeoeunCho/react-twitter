import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "firebaseApp";
import { UserProps } from "App";
import useTranslation from "hooks/useTranslation";
import TweetListPage from "components/tweets/TweetListPage";
import { TweetProps } from "pages/home";

export interface BookmarkProps {
  creatorInfo: any;
  reTweetsObj: any;
  userObj: UserProps;
  loading: boolean;
}

export default function BookmarkTweets({
  creatorInfo,
  reTweetsObj,
  userObj,
}: BookmarkProps) {
  const [tweetBookmark, setTweetBookmark] = useState<TweetProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslation();

  // 트윗 정보 가져오기
  useEffect(() => {
    const tweetsQuery = query(collection(db, "Tweets"));
    onSnapshot(tweetsQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = userArray.filter((id) =>
        creatorInfo.bookmark?.includes(id.id)
      );
      setTweetBookmark(filter as TweetProps[]);
      setLoading(true);
    });
  }, [creatorInfo.bookmark]);

  return (
    <>
      {loading && (
        <>
          {tweetBookmark.length !== 0 ? (
            <div>
              {tweetBookmark?.map((myBook: any) => (
                <TweetListPage
                  key={myBook.id}
                  tweetObj={myBook}
                  userObj={userObj}
                  reTweetsObj={reTweetsObj}
                />
              ))}
            </div>
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>{t("NO_BOOKMARK_TWEET")}</h2>
                <p>{t("SAVE_BOOKMARK")}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
