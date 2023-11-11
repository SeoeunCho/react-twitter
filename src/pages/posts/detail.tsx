import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
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
  const [replies, setReplies] = useState<ReplyProps[] | any>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "Posts", params.id);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  useEffect(() => {
    if (post) {
      let repliesRef = collection(db, "Replies");
      let repliesQuery = query(repliesRef, orderBy("createdAt", "desc"));

      onSnapshot(repliesQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setReplies(dataObj as ReplyProps[]);
      });
    }
  }, [post, replies]);

  return (
    <div className="post">
      <Header menu={"detail"} text={"TAB_MY"} />
      {post ? (
        <>
          <PostBox
            post={post}
            reply={null}
            detailId={post.id}
            postType={"tweet"}
            detailPost={true}
          />
          <ReplyForm post={post} replyModal={false} setReplyModal={false} />

          <ReplyBox
            post={post}
            reply={replies?.filter(
              (reply: ReplyProps) => post.id === reply.postId
            )}
            detailId={post.id}
            postType={"reply"}
            detailPost={false}
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
