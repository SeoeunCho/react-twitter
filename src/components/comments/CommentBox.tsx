import AuthContext from "context/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import styled from "./Comment.module.scss";
import { toast } from "react-toastify";
import useTranslation from "hooks/useTranslation";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: number;
}

interface CommentBoxProps {
  data: CommentProps;
  post: PostProps;
}

export default function CommentBox({ data, post }: CommentBoxProps) {
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const handleDeleteComment = async () => {
    if (post) {
      try {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          comments: arrayRemove(data),
        });

        toast.success(t("DELETE_COMMENT_TOAST"));
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div key={data?.createdAt} className={styled.comment}>
      <div className={styled.comment__borderBox}>
        <div className={styled.comment__imgBox}>
          <div className={styled.comment__flexBox}>
            <img src={`/logo192.png`} alt="profile" />
            <div className={styled.comment__email}>{data?.email}</div>
            <div className={styled.comment__createdAt}>{data?.createdAt}</div>
          </div>
        </div>
        <div className={styled.comment__content}>{data?.comment}</div>
        <div className={styled.comment__submitDiv}>
          {data?.uid === user?.uid && (
            <button
              type="button"
              className={styled.comment__submitDiv}
              onClick={handleDeleteComment}
            >
              {t("BUTTON_DELETE")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
