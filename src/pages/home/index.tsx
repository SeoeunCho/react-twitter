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
} from "firebase/firestore";

import { db } from "firebaseApp";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";
import useTranslation from "hooks/useTranslation";
import Header from "components/header";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: number;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  replies?: any;
  hashTags?: string[];
  imageUrl?: string;
  displayName: string;
}

interface UserProps {
  id: string;
}

type tabType = "all" | "following";

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const [activeTab, setActiveTab] = useState<tabType>("all");
  const [reXweets, setReXweets] = useState([]);

  const { user } = useContext(AuthContext);
  const t = useTranslation();

  // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user?.uid);
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
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      let followingQuery = query(
        postsRef,
        where("uid", "in", followingIds),
        orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });

      onSnapshot(followingQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingPosts(dataObj as PostProps[]);
      });
    }
  }, [followingIds, user]);

  useEffect(() => {
    if (user?.uid) getFollowingIds();
  }, [getFollowingIds, user?.uid]);

  // 리트윗 정보
  useEffect(() => {
    const q = query(collection(db, "reXweets"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reXweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("reXweetArray", reXweetArray);

      // setReXweets(reXweetArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header menu={"home"} text={'MENU_HOME'} />

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
                setActiveTab("following");
              }}
            >
              <div
                className={`btnBox ${
                  activeTab === "following" && "selectedBox"
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
            posts?.map((post) => (
              <PostBox post={post} data={null} detailId={post.id} key={post.id} postType={"xweet"} detailPost={false} />
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

      {activeTab === "following" && (
        <div className="post">
          {followingPosts?.length > 0 ? (
            followingPosts?.map((post) => (
              <PostBox post={post} data={null} detailId={post.id} key={post.id} postType={"xweet"} detailPost={false} />
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
