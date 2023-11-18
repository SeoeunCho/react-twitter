import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import NotificationInnerContents from "./NotificationInnerContents";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";

export default function NotificationReTweet({ reTweetsObj, userObj }: any) {
  const [creatorInfo, setCreatorInfo] = useState<any>([]);
  const [tweets, setTweets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslation();

  // 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Users", reTweetsObj?.email),
      (doc) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      }
    );

    return () => unsubscribe();
  }, [reTweetsObj, userObj.email]);

  // 트윗 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Tweets", reTweetsObj?.parent),
      (doc) => {
        setTweets(doc.data());
      }
    );

    return () => unsubscribe();
  }, [reTweetsObj]);

  return (
    <>
      {loading && (
        <NotificationInnerContents
          creatorInfo={creatorInfo}
          notificationUser={reTweetsObj}
          tweets={tweets}
          text={
            reTweetsObj?.replyId
              ? t("NOTIFICATION_RETWEET")
              : t("NOTIFICATION_TWEET")
          }
        />
      )}
    </>
  );
}
