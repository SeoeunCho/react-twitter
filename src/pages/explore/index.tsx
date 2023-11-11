import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("");
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value.trim());
  };

  console.log("user", user);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "Posts");
      let postsQuery = query(
        postsRef,
        where("hashTags", "array-contains-any", [tagQuery]),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);

  return (
    <div className="home">
      <div className="home__top">
        {/* <Header menu={"explore"} text={"MENU_EXPLORE"}/> */}
        <div className="home__explore-div">
          <input
            className="home__explore"
            placeholder={t("EXPLORE_HASHTAGS")}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="post">
        {posts?.length > 0 ? (
          posts?.map((post) => (
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
          <div className="post__no-posts">
            <div className="post__text">{t("NO_POSTS")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
