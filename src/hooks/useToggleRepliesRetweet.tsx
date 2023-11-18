import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer/user";
import { db } from "firebaseApp";

export const useToggleRepliesRetweet = ({
  reTweetsObj,
  tweetObj,
  userObj,
}: any) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [reTweetsId, setReTweetsId] = useState<any>({});
  const [replyReTweetsId, setReplyReTweetsId] = useState<any>({});
  const [reTweet, setReTweet] = useState<boolean>(false);

  // map 처리 된 리트윗 정보들 중 본인 ID와 같은 index 정보들만 필터링
  useEffect(() => {
    const filter = reTweetsObj.filter((obj: any) => obj.parent === tweetObj.id);
    const index = filter.findIndex((obj: any) => obj?.email === userObj.email);
    setReTweetsId(filter[index]);

    const index2 = reTweetsObj?.findIndex(
      (obj: any) => obj?.replyId && obj?.email === userObj.email
    );
    setReplyReTweetsId(reTweetsObj[index2]);
  }, [reTweetsObj, tweetObj.id, userObj.email]);

  const toggleReTweet = async () => {
    const copy = [...tweetObj.reTweet];
    const filter = copy.filter((reTweet) => {
      return reTweet.email !== userObj.email;
    });

    if (
      tweetObj.reTweet?.some((reTweet: any) => reTweet.email === userObj.email)
    ) {
      if (!tweetObj?.isReply) {
        setReTweet(false);

        await updateDoc(doc(db, "Tweets", tweetObj.id), {
          reTweet: filter,
        });

        const reTweetsRef = doc(db, "ReTweets", reTweetsId.id);
        await deleteDoc(reTweetsRef); // 원글의 리트윗 삭제
        dispatch(
          setCurrentUser({
            ...currentUser,
            reTweet: filter,
          })
        );
      } else {
        setReTweet(false);
        await updateDoc(doc(db, "Replies", tweetObj.id), {
          reTweet: filter,
        });

        const replyReTweetsRef = doc(db, "ReTweets", replyReTweetsId.id);
        await deleteDoc(replyReTweetsRef); // 답글의 리트윗 삭제
        dispatch(
          setCurrentUser({
            ...currentUser,
            reTweet: filter,
          })
        );
      }
    } else {
      setReTweet(true);

      const copy = [
        ...tweetObj.reTweet,
        { email: userObj.email, reTweetAt: Date.now() },
      ];

      if (!tweetObj?.isReply) {
        const reTweetCreator = {
          parentText: tweetObj.text,
          creatorId: userObj.uid,
          email: userObj.email,
          like: [],
          reTweetAt: Date.now(),
          parent: tweetObj.id || null,
          parentEmail: tweetObj.email || null,
        };
        await addDoc(collection(db, "ReTweets"), reTweetCreator);

        await updateDoc(doc(db, "Tweets", tweetObj.id), {
          reTweet: copy,
        });
      } else {
        const reTweetReplyCreator = {
          text: tweetObj.text,
          creatorId: userObj.uid,
          email: userObj.email,
          like: [],
          reTweetAt: Date.now(),
          parent: tweetObj.parent || null,
          parentEmail: tweetObj.parentEmail || null,
          replyId: tweetObj.id || null,
          replyEmail: tweetObj.email || null,
        };
        await addDoc(collection(db, "ReTweets"), reTweetReplyCreator);

        await updateDoc(doc(db, "Replies", tweetObj.id), {
          reTweet: copy,
        });
      }

      dispatch(
        setCurrentUser({
          ...currentUser,
          reTweet: copy,
        })
      );
    }
  };

  return { reTweet, setReTweet, toggleReTweet };
};
