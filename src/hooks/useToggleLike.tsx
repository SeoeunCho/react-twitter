import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function useToggleLike(tweetObj: any) {
  const [liked, setLiked] = useState(false);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const toggleLike = async () => {
    if (tweetObj.like?.some((info: any) => info.email === currentUser.email)) {
      setLiked(false);
      const copy = [...tweetObj.like];
      const filter = copy.filter((info) => info.email !== currentUser.email);

      if (!tweetObj?.parent) {
        await updateDoc(doc(db, "Tweets", tweetObj.id), {
          like: filter,
        });
      } else {
        await updateDoc(doc(db, "Replies", tweetObj.id), {
          like: filter,
        });
      }
    } else {
      setLiked(true);
      const copy = [
        ...tweetObj.like,
        { email: currentUser.email, likeAt: Date.now() },
      ];

      if (!tweetObj?.parent) {
        await updateDoc(doc(db, "Tweets", tweetObj.id), {
          like: copy,
        });
      } else {
        await updateDoc(doc(db, "Replies", tweetObj.id), {
          like: copy,
        });
      }
    }
  };

  return { liked, setLiked, toggleLike };
}
