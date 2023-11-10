import { doc, onSnapshot } from "firebase/firestore";

import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "firebaseApp";
import ReplyForm from "components/reply/ReplyForm";
import ReplyBox, { ReplyProps } from "components/reply/ReplyBox";
import Header from "components/header";

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <Header menu={"detail"} text={"TAB_MY"}/>
      {post ? (
        <>
          <PostBox post={post} data={null} detailId={post.id} postType={"xweet"} detailPost={true} />
          <ReplyForm post={post} replyModal={false} setReplyModal={false} />
          {post?.replies
            ?.slice(0)
            ?.reverse()
            ?.map((data: ReplyProps, index: number) => (
              <ReplyBox data={data} key={index} post={post} />
            ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
