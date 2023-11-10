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
import { ReplyProps } from "components/reply/ReplyBox";
import { languageState } from "atom";
import { useRecoilState } from "recoil";
import ReplyModal from "components/modal/ReplyModal";
import EditXweetModal from "components/modal/EditXweetModal";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function PostBox({
  post,
  data,
  detailId,
  postType,
  detailPost,
}: {
  post: PostProps;
  data: ReplyProps | null;
  detailId: string;
  postType: string;
  detailPost: boolean;
}) {
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [EDModal, setEDModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [replyModal, setReplyModal] = useState<boolean>(false);
  // const [detailPost, setDetailPost] = useState<boolean>(false);
  const location = useLocation();
  const language = useRecoilState(languageState);

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

  const handleDelete = async () => {
    if (postType === "xweet") {
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
    } else {
      if (post) {
        try {
          const postRef = doc(db, "posts", post?.id);
          await updateDoc(postRef, {
            replies: arrayRemove(data),
          });

          toast.success(t("DELETE_REPLY_TOAST"));
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  // console.log("user", user?.email, user?.uid);

  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
  };

  const toggleEDModal = () => {
    setEDModal((prev) => !prev);
  };

  const toggleEditModal = () => {
    setEditModal((prev) => !prev);
  };

  //  map 처리 된 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", post.email), (doc) => {
      setCreatorInfo(doc?.data());
      // setLoading(true);
    });
    return () => unsubscribe();
  }, [post.email]);

  // 수정,삭제 모달창 외부영역 클릭시 닫힘 처리
  useEffect(() => {
    const handleOutsideClose = (e: { target: any }) => {
      if (EDModal && editRef !== null) {
        if (!editRef.current.contains(e.target)) setEDModal(false);
      }
    };
    document.addEventListener("click", handleOutsideClose);

    return () => document.removeEventListener("click", handleOutsideClose);
  }, [EDModal]);

  return (
    <>
      <li className={`${styled.xweet} ${detailPost && styled.hoverPost}`}>
        <div className={styled.xweet__wrapper}>
          <div className={styled.xweet__container}>
            {/* 프로필 이미지 */}
            <Link
              className={styled.xweet__profile}
              to={
                postType === "xweet"
                  ? `/profile/${post?.email}`
                  : `/profile/${data?.email}`
              }
            >
              {/* 트윗 프로필 이미지 */}
              {postType === "xweet" &&
                (post?.profileUrl ? (
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
                ))}

              {/* 답글 프로필 이미지 */}
              {postType === "reply" &&
                (data?.profileUrl ? (
                  <img
                    src={data?.profileUrl}
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
                ))}
            </Link>

            {/* 유저 정보 */}
            <div className={styled.userInfo}>
              <div className={styled.userInfo__name}>
                <div className={styled.userInfo__one}>
                  <Link
                    type="button"
                    to={
                      postType === "xweet"
                        ? `/profile/${post?.email}`
                        : `/profile/${data?.email}`
                    }
                  >
                    {postType === "xweet"
                      ? post?.displayName || post?.email.split("@")[0]
                      : data?.displayName || data?.email.split("@")[0]}
                  </Link>
                  {/* <FollowingBox post={post} /> */}
                </div>
                <div className={styled.userInfo__two}>
                  {postType === "xweet" ? (
                    <p>@{post?.email ? post?.email.split("@")[0] : ""}</p>
                  ) : (
                    <p>@{data?.email ? data?.email.split("@")[0] : ""}</p>
                  )}

                  <p style={{ margin: "0 4px" }}>·</p>
                  <p className={styled.xweet__createdAt}>
                    {postType === "xweet"
                      ? timeToString(post?.createdAt)
                      : timeToString(data?.createdAt)}
                  </p>
                </div>
              </div>

              {/* 트윗 수정,삭제 버튼 */}
              {postType === "xweet" && user?.uid === post?.uid && (
                <div className={styled.xweet__edit} ref={editRef}>
                  <div
                    className={styled.xweet__editIcon}
                    onClick={toggleEDModal}
                  >
                    <FiMoreHorizontal />
                    <div className={styled.horizontal__bg}></div>
                  </div>
                  {EDModal && user?.uid === post?.uid && (
                    <div className={styled.container}>
                      <div
                        className={`${styled.btn} ${styled.updateBtn}`}
                        onClick={toggleEditModal}
                      >
                        <FiEdit />
                        <p>{t("BUTTON_EDIT")}</p>
                      </div>
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

              {/* 답글 수정,삭제 버튼 */}
              {postType === "reply" && user?.uid === data?.uid && (
                <div className={styled.xweet__edit} ref={editRef}>
                  <div
                    className={styled.xweet__editIcon}
                    onClick={toggleEDModal}
                  >
                    <FiMoreHorizontal />
                    <div className={styled.horizontal__bg}></div>
                  </div>
                  {EDModal && user?.uid === data?.uid && (
                    <div className={styled.container}>
                      <div
                        className={`${styled.btn} ${styled.updateBtn}`}
                        onClick={toggleEditModal}
                      >
                        <FiEdit />
                        <p>{t("BUTTON_EDIT")}</p>
                      </div>
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

          {/* 컨텐츠 */}
          <Link
            to={postType === "xweet" ? `/posts/${post?.id}` : "/"}
            className={`${styled.xweet__content} ${
              detailPost && styled.detailPost
            }`}
          >
            {/* {postType === "reply" && (
              <div className={`${styled.xweet__reply} ${styled.select}`}>
                <Link
                  className={styled.xweet__replyText}
                  to={`/profile/${data?.email}`}
                >
                  {language[0] === "en" && <p>{t("REPLY_TO")}&nbsp;</p>}
                  <p>@{post.email?.split("@")[0]}</p>
                  {language[0] === "ko" && <p>&nbsp;{t("REPLY_TO")}</p>}
                </Link>
              </div>
            )} */}

            <div className={styled.xweet__text}>
              <h4>{postType === "xweet" ? post?.content : data?.reply}</h4>
              {post?.hashTags?.length !== 0 && (
                <div
                  className={`${styled.xweet__text__hashtags} ${styled.focus}`}
                >
                  <span className={styled.xweet__text__hashtags_outputs}>
                    {post?.hashTags?.map((tag, index) => (
                      <span
                        className={styled.xweet__text__hashtags_tag}
                        key={index}
                      >
                        #{tag}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* 트윗 이미지 콘텐츠 */}
            {postType === "xweet" && post?.imageUrl && (
              <div className={styled.xweet__image}>
                <img src={post?.imageUrl} alt="uploaded file" loading="lazy" />
              </div>
            )}
            {/* 답글 이미지 콘텐츠 */}
            {postType === "reply" && data?.imageUrl && (
              <div className={styled.xweet__image}>
                <img src={data?.imageUrl} alt="uploaded file" loading="lazy" />
              </div>
            )}
          </Link>
        </div>

        {/* 트윗 액션버튼 바 */}
        {!detailPost && postType === "xweet" && (
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

            <div className={`${styled.actionBox} ${styled.reply}`}>
              {/* <Link to={`/posts/${post?.id}`}>
                <div className={styled.actions__icon}>
                  <FaRegComment />
                </div>
              </Link> */}

              <div className={styled.actions__icon} onClick={toggleReplyModal}>
                <FaRegComment />
              </div>

              <div className={styled.actions__text}>
                <p>{post?.replies?.length || 0}</p>
              </div>
            </div>
          </nav>
        )}

        {/* 디테일 액션버튼 바 */}
        {detailPost && postType === "xweet" && (
          <nav className={styled.xweet__actions_detail}>
            {(post?.replies || post?.likes) && (
              <div className={styled.actions__text}>
                <div className={styled.reply__text}>
                  <span>{post?.replies?.length}</span>
                  <span> {t("TAB_REPLY")}</span>
                </div>
                {/* // <div className={styled.rexweet__text}>
                //   {post.rexweet?.length === 0 ? (
                //     ""
                //   ) : (
                //     <>
                //       <span>{xweetObj.rexweet?.length}</span>
                //       <span> 리트윗</span>
                //     </>
                //   )}
                // </div> */}
                <div className={styled.like__text}>
                  <span>{post?.likes?.length}</span>
                  <span> {t("ACTION_LIKES")}</span>
                </div>
              </div>
            )}
            <div className={styled.actionBox}>
              <div className={styled.reply}>
                <div
                  className={styled.actions__icon}
                  onClick={toggleReplyModal}
                >
                  <FaRegComment />
                </div>
              </div>
              {/* <div
                className={`${styled.rexweetBox} ${rexweet && styled.rexweet}`}
              >
                <div className={styled.actions__icon} onClick={toggleRexweet}>
                  <FiRepeat />
                </div>
              </div> */}
              <div className={`${styled.likeBox} ${styled.like}`}>
                <div className={styled.actions__icon} onClick={toggleLike}>
                  {user && post?.likes?.includes(user.uid) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </div>
              </div>
              {/* <div
                className={`${styled.bookmarkBox} ${
                  bookmark && styled.bookmark
                }`}
              >
                <div className={styled.actions__icon} onClick={toggleBookmark}>
                  {bookmark ? <FaBookmark /> : <FaRegBookmark />}
                </div>
              </div> */}
            </div>
          </nav>
        )}
      </li>
      {editModal && (
        <EditXweetModal
          detailId={detailId}
          editModal={editModal}
          setEditModal={setEditModal}
        />
      )}

      {replyModal && (
        <ReplyModal
          replyModal={replyModal}
          setReplyModal={setReplyModal}
          post={post}
        />
      )}
    </>
  );
}
