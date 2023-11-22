import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "firebaseApp";

export default function useGetFbInfo() {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [myInfo, setMyInfo] = useState<any>(null);
  const [reTweets, setReTweets] = useState<any>([]);
  const [fbLoading, setFbLoading] = useState({
    myInfo: false,
    reTweets: false,
  });

  // 본인 정보 가져오기
  useEffect(() => {
    if (currentUser?.email) {
      onSnapshot(doc(db, "Users", `${currentUser.email}`), (doc: any) => {
        setMyInfo(doc.data());
        setFbLoading((prev) => ({ ...prev, myInfo: true }));
      });
    }
  }, [currentUser.email]);

  // 리트윗 정보
  useEffect(() => {
    const reTweetQuery = query(
      collection(db, "ReTweets"),
      orderBy("reTweetAt", "desc")
    );

    const unsubscribe = onSnapshot(reTweetQuery, (snapShot) => {
      const reTweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReTweets(reTweetArray);
      setFbLoading((prev) => ({ ...prev, reTweets: true }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { myInfo, reTweets, fbLoading };
}
