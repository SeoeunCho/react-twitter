import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import useGetFbInfo from "../../hooks/useGetFbInfo";
import { db } from "firebaseApp";
import NotificationInnerContents from "./NotificationInnerContents";
import useTranslation from "hooks/useTranslation";

export default function NotificationFollow({ followObj }: any) {
  const [creatorInfo, setCreatorInfo] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { myInfo } = useGetFbInfo(); // 내 정보 가져오기
  const t = useTranslation();

  // 팔로워 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", followObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [followObj]);

  return (
    <>
      {loading && (
        <NotificationInnerContents
          creatorInfo={creatorInfo}
          userInfo={myInfo}
          notificationUser={followObj}
          text={t("NOTIFICATION_FOLLOW")}
        />
      )}
    </>
  );
}
