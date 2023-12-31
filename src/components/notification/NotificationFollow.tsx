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
  const [loading, setLoading] = useState<boolean>(false);
  const { myInfo } = useGetFbInfo(); // 내 정보 가져오기
  const t = useTranslation();

  // 팔로워 정보 가져오기
  useEffect(() => {
    if (followObj?.email) {
      onSnapshot(doc(db, "Users", `${followObj.email}`), (doc) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      });
    }

    return () => {
      setLoading(false);
    };
  }, [followObj.email]);

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
