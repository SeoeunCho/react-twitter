import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import TweetListPage from "components/tweets/TweetListPage";

export default function BookmarkReplies({
  creatorInfo,
  reTweetsObj,
  userObj,
}: any) {
  const [repliesBookmark, setRepliesBookmark] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslation();

  // 답글 정보 가져오기
  useEffect(() => {
    const repliesQuery = query(collection(db, "Replies"));
    onSnapshot(repliesQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = userArray.filter((id) =>
        creatorInfo.bookmark?.includes(id.id)
      );
      setRepliesBookmark(filter);
      setLoading(true);
    });
  }, [creatorInfo.bookmark]);

  return (
    <>
      {loading && (
        <>
          {repliesBookmark.length !== 0 ? (
            <div>
              {repliesBookmark?.map((myBook: any) => (
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
                <h2>{t("NO_BOOKMARK_REPLY")}</h2>
                <p>{t("SAVE_BOOKMARK")}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
