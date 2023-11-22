import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer/user";
import { db } from "firebaseApp";

export const useToggleBookmark = (tweetObj: any) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [bookmark, setBookmark] = useState(false);

  const toggleBookmark = async () => {
    if (currentUser.bookmark?.includes(tweetObj.id)) {
      setBookmark(false);
      const copy = [...currentUser.bookmark];
      const filter = copy.filter((id) => id !== tweetObj.id);
      
      if (currentUser?.email) {
        await updateDoc(doc(db, "Users", `${currentUser.email}`), {
          bookmark: filter,
        });
      }

      dispatch(
        setCurrentUser({
          ...currentUser,
          bookmark: filter,
        })
      );
    } else {
      setBookmark(true);
      const copy = [...currentUser.bookmark];
      copy.push(tweetObj.id);

      if (currentUser?.email) {
        await updateDoc(doc(db, "Users", `${currentUser.email}`), {
          bookmark: copy,
        });
      }

      dispatch(
        setCurrentUser({
          ...currentUser,
          bookmark: copy,
        })
      );
    }
  };
  return { bookmark, setBookmark, toggleBookmark };
};
