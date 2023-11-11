import { useCallback, useContext, useEffect, useState } from "react";
import PostForm from "components/posts/PostForm";
import PostBox from "components/posts/PostBox";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

import { db } from "firebaseApp";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";
import useTranslation from "hooks/useTranslation";
import Header from "components/header";
import { ReplyProps } from "components/reply/ReplyBox";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: number;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  hashTags?: string[];
  imageUrl?: string;
  displayName: string;
}

interface UserProps {
  id: string;
}

type tabType = "all" | "Following";

export default function HomePage() {
  const [posts, setPosts] = useState<any>([]);
  const [replies, setReplies] = useState<ReplyProps[] | null>(null);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const [activeTab, setActiveTab] = useState<tabType>("all");
  const [reTweets, setReTweets] = useState([]);

  const { user } = useContext(AuthContext);
  const t = useTranslation();

  // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "Following", user?.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds([""]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds((prev: string[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      // Posts 컬렉션 출력
      let postsRef = collection(db, "Posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });

      // Replies 컬렉션 출력
      let repliesRef = collection(db, "Replies");
      let repliesQuery = query(repliesRef, orderBy("createdAt", "desc"));
      onSnapshot(repliesQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setReplies(dataObj as ReplyProps[]);
      });

      // Following 컬렉션 출력
      let followingQuery = query(
        postsRef,
        where("uid", "in", followingIds),
        orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
      );
      onSnapshot(followingQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingPosts(dataObj as PostProps[]);
      });
    }
  }, [followingIds, replies, user]);

  useEffect(() => {
    if (user?.uid) getFollowingIds();
  }, [getFollowingIds, user?.uid]);

  // 리트윗 정보
  useEffect(() => {
    const q = query(collection(db, "ReTweets"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reTweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("reTweetArray", reTweetArray);

      // setReTweets(reTweetArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header menu={"home"} text={"MENU_HOME"} />

      <div className="tab__container">
        <div className="main__container">
          <nav className="categoryList">
            <div
              className="container sizeContainer"
              onClick={() => {
                setActiveTab("all");
              }}
            >
              <div className={`btnBox ${activeTab === "all" && "selectedBox"}`}>
                {t("TAB_ALL")}
              </div>
            </div>
            <div
              className="container sizeContainer"
              onClick={() => {
                setActiveTab("Following");
              }}
            >
              <div
                className={`btnBox ${
                  activeTab === "Following" && "selectedBox"
                }`}
              >
                {t("TAB_FOLLOWING_ING")}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {activeTab === "all" && (
        <>
          <PostForm />
          {posts?.length > 0 ? (
            posts?.map((post: PostProps) => (
              <PostBox
                post={post}
                reply={replies?.filter((reply) => post.id === reply.postId)}
                detailId={post.id}
                key={post.id}
                postType={"tweet"}
                detailPost={false}
              />
            ))
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>{t("NO_POSTS")}</h2>
                <p>{t("NO_POSTS_LIST")}</p>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "Following" && (
        <div className="post">
          {followingPosts?.length > 0 ? (
            followingPosts?.map((post) => (
              <PostBox
                post={post}
                reply={null}
                detailId={post.id}
                key={post.id}
                postType={"tweet"}
                detailPost={false}
              />
            ))
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>{t("NO_POSTS")}</h2>
                <p>{t("NO_POSTS_FLLOWING")}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
