import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../reducer/user";
import styled from "./TweetEditDeleteBtn.module.scss";
import { db, storage } from "firebaseApp";

export default function TweetEditDeleteBtn({
  tweetAttachment,
  tweetObj,
  toggleEdit,
  setTweetEtc,
}: any) {
  // tweets는 원글 정보
  // tweetObj는 답글 정보
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [tweets, setTweets] = useState<any>([]);
  const [reTweets, setReTweets] = useState<any>([]);
  const [replies, setReplies] = useState<any>("");
  const dispatch = useDispatch();
  const dbRef = doc(db, "Tweets", `${tweetObj.id}`);
  const repliesRef = doc(db, "Replies", `${tweetObj.id}`);
  const dbAttachmentRef = ref(storage, tweetAttachment);

  // 원글의 답글 정보 가져오기
  useEffect(() => {
    const tweetsQuery = query(collection(db, "Tweets"));
    onSnapshot(tweetsQuery, (snapShot) => {
      const userArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = userArray.filter((asd: any) =>
        asd?.replyId?.includes(tweetObj.id)
      );

      setTweets(filter[0]);
    });
  }, [tweetObj.id]);

  // 답글 정보 가져오기
  useEffect(() => {
    const repliesQuery = query(collection(db, "Replies"));
    onSnapshot(repliesQuery, (snapShot) => {
      const replyArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const parentTweet = replyArray.findIndex(
        (reply: any) => reply.parent === tweetObj.id
      );

      setReplies(replyArray[parentTweet]);
    });
  }, [currentUser, tweetObj.id]);

  // 리트윗 가져오기
  useEffect(() => {
    const reTweetsQuery = query(collection(db, "ReTweets"));

    onSnapshot(reTweetsQuery, (snapShot) => {
      const reTweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = reTweetArray.findIndex(
        (asd: any) => asd.parentEmail === currentUser.email
      );

      setReTweets(reTweetArray[filter]);
    });
  }, [currentUser.email]);

  const onDeleteClick = async () => {
    const ok = window.confirm("트윗을 삭제할까요?");

    if (ok === true) {
      // 원글 삭제
      await deleteDoc(dbRef);

      // 원글 삭제 시 원글의 리트윗 삭제
      if (reTweets?.parent?.includes(tweetObj.id)) {
        const reTweetsRef = doc(db, "ReTweets", reTweets?.id);
        await deleteDoc(reTweetsRef);
      }
      // 원글 삭제 시 답글 삭제
      if (replies?.parent?.includes(tweetObj.id)) {
        const dbRepliesRef = doc(db, "Replies", replies.id);
        await deleteDoc(dbRepliesRef); // 리트윗 삭제
      }

      // 이미지 삭제
      if (tweetAttachment) {
        await deleteObject(dbAttachmentRef);
      }

      // 답글만 삭제
      if (tweets?.replyId?.includes(tweetObj.id)) {
        const copy = [...tweets.replyId];
        const filter = copy.filter((reply) => reply !== tweetObj.id);
        await updateDoc(doc(db, "Tweets", tweets.id), {
          replyId: filter,
        });
        await deleteDoc(repliesRef); // 답글 삭제

        dispatch(
          setCurrentUser({
            ...currentUser,
            replyId: filter,
          })
        );
      }

      setTweetEtc && setTweetEtc(false);
    }
  };

  return (
    <div className={styled.container}>
      <div className={`${styled.btn} ${styled.updateBtn}`} onClick={toggleEdit}>
        <FiEdit />
        <p>수정하기</p>
      </div>
      <div
        className={`${styled.btn} ${styled.deleteBtn}`}
        onClick={onDeleteClick}
      >
        <FiTrash2 />
        <p>삭제하기</p>
      </div>
    </div>
  );
}
