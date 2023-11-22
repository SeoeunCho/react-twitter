import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "firebaseApp";
import NotificationInnerContents from "./NotificationInnerContents";
import useTranslation from "hooks/useTranslation";

export default function NotificationReply({ replyObj }: any) {
  const [creatorInfo, setCreatorInfo] = useState<any>([]);
  const [tweets, setTweets] = useState<any>([]);
  const t = useTranslation();

  // 정보 가져오기
  useEffect(() => {
    if (replyObj?.email) {
      onSnapshot(doc(db, "Users", `${replyObj.email}`), (doc) => {
        setCreatorInfo(doc.data());
      });
    }
  }, [replyObj.email]);

  // 트윗 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Tweets", replyObj.parent),
      (doc) => {
        setTweets(doc.data());
      }
    );
    return () => unsubscribe();
  }, [replyObj]);

  return (
    <>
      {creatorInfo.length !== 0 && tweets.length !== 0 && (
        <NotificationInnerContents
          creatorInfo={creatorInfo}
          notificationUser={replyObj}
          tweets={tweets}
          text={t("NOTIFICATION_REPLY")}
        />
      )}
    </>
  );
}
