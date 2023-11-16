import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer/user";
import { db } from "firebaseApp";

export const useToggleFollow = (myInfo: any) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const toggleFollow = async (userInfo: any) => {
    if (
      myInfo.following?.some((follow: any) => follow.email === userInfo.email)
    ) {
      const followCopyFilter = myInfo.following.filter(
        (follow: any) => follow.email !== userInfo.email
      );

      const followerCopyFilter = userInfo.follower.filter(
        (follow: any) => follow.email !== myInfo.email
      );

      const updateMyInfo = () =>
        updateDoc(doc(db, "Users", myInfo.email), {
          following: followCopyFilter,
        });

      const updateUserInfo = () =>
        updateDoc(doc(db, "Users", userInfo.email), {
          follower: followerCopyFilter,
        });

      await Promise.all([updateMyInfo(), updateUserInfo()]).then(() => {
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: followCopyFilter,
          })
        );
      });
    } else {
      const time = Date.now();

      const updateMyInfo = () =>
        updateDoc(doc(db, "Users", myInfo.email), {
          following: [
            ...myInfo.following,
            { email: userInfo.email, followAt: time },
          ],
        });
      const updateUserInfo = () =>
        updateDoc(doc(db, "Users", userInfo.email), {
          follower: [
            ...userInfo.follower,
            { email: myInfo.email, followAt: time },
          ],
        });

      await Promise.all([updateMyInfo(), updateUserInfo()]).then(() => {
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: [
              ...myInfo.following,
              { email: userInfo.email, followAt: time },
            ],
          })
        );
      });
    }
  };

  return toggleFollow;
};
