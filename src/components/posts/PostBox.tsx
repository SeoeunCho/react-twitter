import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  updateDoc,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useRef, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ref, deleteObject } from "firebase/storage";
import FollowingBox from "components/following/FollowingBox";
import useTranslation from "hooks/useTranslation";
// import usePostEditModalClick from "hooks/usePostEditModal";
import styled from "./PostBox.module.scss";
import { useTimeToString } from "hooks/useTimeToString";
import { FiEdit, FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function PostBox({
  post,
  editPost,
}: {
  post: PostProps;
  editPost: boolean;
}) {
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [editModal, setEditModal] = useState<boolean>(false);
  // const [editPost, setEditPost] = useState<boolean>(false);
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);
  const editRef = useRef<any>();
  const t = useTranslation();
  const { timeToString } = useTimeToString();

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      // 사용자가 좋아요를 미리 한 경우 -> 좋아요를 취소한다.
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      // 사용자가 좋아요를 하지 않은 경우 -> 좋아요를 추가한다.
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };

  const toggleEditModal = (e: any) => {
    setEditModal((prev) => !prev);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(t("CHECK_DELETE_POST_TOAST"));
    if (confirm) {
      // 스토리지 이미지 먼저 삭제
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }

      await deleteDoc(doc(db, "posts", post.id));
      toast.success(t("DELETE_POST_TOAST"));
      navigate("/");
    }
  };

  // console.log("user", user?.email, user?.uid);

  //  map 처리 된 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", post.email), (doc) => {
      setCreatorInfo(doc?.data());
      // setLoading(true);
    });
    return () => unsubscribe();
  }, [post.email]);

  // 수정모달창 외부영역 클릭시 닫힘 처리
  useEffect(() => {
    const handleOutsideClose = (e: { target: any }) => {
      if (editModal && editRef !== null) {
        if (!editRef.current.contains(e.target)) setEditModal(false);
      }
    };
    document.addEventListener("click", handleOutsideClose);

    return () => document.removeEventListener("click", handleOutsideClose);
  }, [editModal]);

  return (
    <>
      <li className={`${styled.xweet} ${editPost && styled.hoverPost}`}>
        <div className={styled.xweet__wrapper}>
          <div className={styled.xweet__container}>
            {/* 프로필 이미지 */}
            <Link
              className={styled.xweet__profile}
              to={`/profile/${post?.email}`}
            >
              {post?.profileUrl ? (
                <img
                  src={post?.profileUrl}
                  alt="profileImg"
                  loading="lazy"
                  className={styled.profile__image}
                />
              ) : (
                <img
                  src={PROFILE_DEFAULT_URL}
                  alt="profileImg"
                  loading="lazy"
                  className={styled.profile__image}
                />
              )}
            </Link>

            <div className={styled.userInfo}>
              <div className={styled.userInfo__name}>
                <Link
                  className={styled.userInfo__one}
                  to={`/profile/${post?.email}`}
                >
                  <p>{post?.displayName || post?.email.split("@")[0]}</p>
                  <FollowingBox post={post} />
                </Link>
                <div className={styled.userInfo__two}>
                  <p>@{post?.email ? post?.email.split("@")[0] : ""}</p>
                  <p style={{ margin: "0 4px" }}>·</p>
                  <p className={styled.xweet__createdAt}>
                    {timeToString(post?.createdAt)}
                  </p>
                </div>
              </div>

              {/* 포스트 수정,삭제 버튼 */}
              {user?.uid === post?.uid && (
                <div className={styled.xweet__edit} ref={editRef}>
                  <div
                    className={styled.xweet__editIcon}
                    onClick={toggleEditModal}
                  >
                    <FiMoreHorizontal />
                    <div className={styled.horizontal__bg}></div>
                  </div>
                  {editModal && user?.uid === post?.uid && (
                    <div className={styled.container}>
                      <Link
                        className={`${styled.btn} ${styled.updateBtn}`}
                        to={`/posts/edit/${post?.id}`}
                      >
                        <FiEdit />
                        <p>{t("BUTTON_EDIT")}</p>
                      </Link>
                      <div
                        className={`${styled.btn} ${styled.deleteBtn}`}
                        onClick={handleDelete}
                      >
                        <FiTrash2 />
                        <p>{t("BUTTON_DELETE")}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 포스트 컨텐츠 */}
          <Link
            to={`/posts/${post?.id}`}
            className={`${styled.xweet__content} ${
              editPost && styled.editPost
            }`}
          >
            <div className={styled.xweet__text}>
              <h4>{post?.content}</h4>
            </div>
            {post?.imageUrl ? (
              <div className={styled.xweet__image}>
                <img src={post?.imageUrl} alt="uploaded file" loading="lazy" />
              </div>
            ) : null}
          </Link>
        </div>

        {/* 액션버튼 바 */}
        <nav className={styled.xweet__actions}>
          <div className={`${styled.actionBox} ${styled.like}`}>
            <div className={styled.actions__icon} onClick={toggleLike}>
              {user && post?.likes?.includes(user.uid) ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </div>
            <div className={styled.actions__text}>
              <p>{post?.likeCount || 0}</p>
            </div>
          </div>

          <div className={`${styled.actionBox} ${styled.comment}`}>
            <Link to={`/posts/${post?.id}`}>
              <div className={styled.actions__icon}>
                <FaRegComment />
              </div>
            </Link>

            <div className={styled.actions__text}>
              <p>{post?.comments?.length || 0}</p>
            </div>
          </div>
        </nav>
      </li>
    </>
  );
}
