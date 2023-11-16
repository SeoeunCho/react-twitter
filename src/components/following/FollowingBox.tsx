import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { TweetProps } from "pages/home";
import { ReplyProps } from "components/reply/ReplyBox";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  tweet: TweetProps;
  reply: ReplyProps | null;
  tweetType: string;
}

interface UserProps {
  id: string;
}

export default function FollowingBox({
  tweet,
  reply,
  tweetType,
}: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [tweetFollowers, setTweetFollowers] = useState<any>([]);
  const t = useTranslation();

  const onClickFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        // 내가 주체가 되어 '팔로잉' 컬렉션 생성 or 업데이트
        const followingRef = doc(db, "Following", user?.uid);

        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: tweet?.uid }),
          },
          { merge: true }
        );

        // 팔로우 당하는 사람이 주체가 되어 '팔로우' 컬렉션 생성 or 업데이트
        const followerRef = doc(db, "Follower", tweet?.uid);

        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );

        // 팔로잉 알림 생성
        await addDoc(collection(db, "Notifications"), {
          content: null,
          createdAt: Date.now(),
          uid: tweet?.uid,
          profileUrl: user?.photoURL,
          isRead: false,
          email: user?.email,
          url: `/profile/${user?.email}`,
          displayName: user?.displayName || user?.email?.split("@")[0],
        });

        toast.success(t("FOLLOWING_TOAST"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "Following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: tweet?.uid }),
        });
        const followerRef = doc(db, "Follower", tweet?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });

        toast.success(t("UN_FOLLOWING_TOAST"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowers = useCallback(async () => {
    if (tweet.uid) {
      const ref = doc(db, "Follower", tweet.uid);
      onSnapshot(ref, (doc) => {
        setTweetFollowers([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setTweetFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
  }, [tweet.uid]);

  // console.log("data", tweetFollowers);

  useEffect(() => {
    if (tweet.uid) getFollowers();
  }, [getFollowers, tweet.uid]);

  return (
    <>
      {tweetType === "tweet" &&
        user?.uid !== tweet?.uid &&
        (tweetFollowers.includes(user?.uid) ? (
          <button
            type="button"
            className="tweet__following-btn"
            onClick={onClickDeleteFollow}
          >
            {t("BUTTON_FOLLOWING")}
          </button>
        ) : (
          <button
            type="button"
            className="tweet__follow-btn"
            onClick={onClickFollow}
          >
            {t("BUTTON_FOLLOW")}
          </button>
        ))}

      {tweetType === "reply" &&
        user?.uid !== reply?.uid &&
        (tweetFollowers.includes(user?.uid) ? (
          <button
            type="button"
            className="tweet__following-btn"
            onClick={onClickDeleteFollow}
          >
            {t("BUTTON_FOLLOWING")}
          </button>
        ) : (
          <button
            type="button"
            className="tweet__follow-btn"
            onClick={onClickFollow}
          >
            {t("BUTTON_FOLLOW")}
          </button>
        ))}
    </>
  );
}
