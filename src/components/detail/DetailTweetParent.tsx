import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "./DetailTweetParent.module.scss";
import { FiMoreHorizontal, FiRepeat } from "react-icons/fi";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useToggleLike from "hooks/useToggleLike";
import { useToggleBookmark } from "hooks/useToggleBookmark";
import { useTimeToString } from "hooks/useTimeToString";
import { db } from "firebaseApp";
import TweetEditDeleteBtn from "components/buttons/TweetEditDeleteBtn";
import EditTweetModal from "components/modal/EditTweetModal";
import ReplyModal from "components/modal/ReplyModal";
import useHandleOutsideClick from "hooks/useHandleOutsideClick";
import useTranslation from "hooks/useTranslation";
import { useToggleRepliesRetweet } from "hooks/useToggleRepliesRetweet";

export default function DetailTweetParent({
  tweetObj,
  userObj,
  reTweetsObj,
}: any) {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const etcRef = useRef<any>();
  const [newTweet, setNewTweet] = useState<any>(tweetObj?.text);
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [replyModal, setReplyModal] = useState<boolean>(false);
  const [tweetEditDelBtn, setTweetEditDelBtn] = useState<boolean>(false);
  const { reTweet, setReTweet, toggleReTweet } = useToggleRepliesRetweet({
    reTweetsObj,
    tweetObj,
    userObj,
  });
  const { liked, setLiked, toggleLike } = useToggleLike(tweetObj);
  const { bookmark, setBookmark, toggleBookmark } = useToggleBookmark(tweetObj);
  const t = useTranslation();

  useHandleOutsideClick({
    ref: etcRef,
    isModal: tweetEditDelBtn,
    setIsModal: setTweetEditDelBtn,
  });
  const { timeToString2 } = useTimeToString();

  //  map 처리 된 각 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", tweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });

    return () => unsubscribe();
  }, [tweetObj]);

  useEffect(() => {
    // 좋아요 목록 중 본인 아이디 있으면 true
    const checkLiked = () => {
      const hasCurrentUserLiked = tweetObj?.like?.some(
        (like: { email: string }) => like.email === currentUser.email
      );
      setLiked(hasCurrentUserLiked);
    };

    // 리트윗된 본인 아이디 있으면 true
    const checkReTweet = () => {
      const hasCurrentUserReTweeted = tweetObj?.reTweet?.some(
        (arr: { email: string }) => arr.email === userObj.email
      );
      setReTweet(hasCurrentUserReTweeted);
    };

    // 북마크된 본인 아이디 있으면 true
    const checkBookmark = () => {
      const hasCurrentUserBookmarked = currentUser?.bookmark?.includes(
        tweetObj.id
      );
      setBookmark(hasCurrentUserBookmarked);
    };

    checkLiked();
    checkReTweet();
    checkBookmark();
  }, [tweetObj, currentUser, userObj, setLiked, setReTweet, setBookmark]);

  const toggleEditDelBtn = () => {
    setTweetEditDelBtn((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
  };

  return (
    <>
      {loading && (
        <>
          <div className={styled.tweet}>
            {reTweet && (
              <div className={styled.tweet__reTweet}>
                <div className={styled.tweet__reTweetIcon}>
                  <FiRepeat />
                </div>
                <p>
                  @{currentUser.displayName} {t("RETWEET_TEXT")}
                </p>
              </div>
            )}
            <div className={styled.tweet__wrapper}>
              <div className={styled.tweet__container}>
                <Link
                  to={`/profile/mytweets/${tweetObj?.email}`}
                  className={styled.tweet__profile}
                >
                  <img
                    src={creatorInfo.photoURL}
                    alt="profileImg"
                    className={styled.profile__image}
                    loading="lazy"
                  />
                </Link>
                <div className={styled.userInfo}>
                  <div className={styled.userInfo__name}>
                    <Link
                      to={`/profile/mytweets/${tweetObj?.email}`}
                      className={styled.userInfo__one}
                    >
                      <p>{creatorInfo.displayName}</p>
                    </Link>
                    <div className={styled.userInfo__two}>
                      <p>
                        @
                        {creatorInfo.email
                          ? creatorInfo.email.split("@")[0]
                          : ""}
                      </p>
                    </div>
                  </div>
                  {userObj.email === tweetObj.email && (
                    <div className={styled.tweet__edit} ref={etcRef}>
                      <div
                        className={styled.tweet__editIcon}
                        onClick={toggleEditDelBtn}
                      >
                        <FiMoreHorizontal />
                        <div className={styled.horizontal__bg}></div>
                      </div>
                      {tweetEditDelBtn && (
                        <TweetEditDeleteBtn
                          tweetAttachment={tweetObj.attachmentUrl}
                          tweetObj={tweetObj}
                          toggleEdit={toggleEdit}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={styled.tweet__text}>
                <h4>{tweetObj.text}</h4>
              </div>
              <div className={styled.tweet__created}>
                <p className={styled.tweet__createdAt}>
                  {timeToString2(tweetObj.createdAt)}
                </p>
              </div>
            </div>
            {tweetObj.attachmentUrl ? (
              <div className={styled.tweet__image}>
                <img
                  src={tweetObj.attachmentUrl}
                  alt="uploaded file"
                  loading="lazy"
                />
              </div>
            ) : null}
            <nav className={styled.tweet__actions}>
              {(tweetObj.replyId.length ||
                tweetObj.reTweet.length ||
                tweetObj.like.length) !== 0 && (
                <div className={styled.actions__text}>
                  <div className={styled.comment__text}>
                    {tweetObj.replyId?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <span>{tweetObj.replyId?.length}</span>
                        <span> {t("TAB_REPLY")}</span>
                      </>
                    )}
                  </div>
                  <div className={styled.reTweet__text}>
                    {tweetObj.reTweet?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <span>{tweetObj.reTweet?.length}</span>
                        <span> {t("TAB_RETWEET")}</span>
                      </>
                    )}
                  </div>
                  <div className={styled.like__text}>
                    {tweetObj.like?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <span>{tweetObj.like?.length}</span>
                        <span> {t("ACTION_LIKES")}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className={styled.actionBox}>
                <div className={styled.comment}>
                  <div
                    className={styled.actions__icon}
                    onClick={toggleReplyModal}
                  >
                    <FaRegComment />
                  </div>
                </div>
                <div
                  className={`${styled.reTweetBox} ${
                    reTweet && styled.reTweet
                  }`}
                >
                  <div className={styled.actions__icon} onClick={toggleReTweet}>
                    <FiRepeat />
                  </div>
                </div>
                <div className={`${styled.likeBox} ${liked && styled.like}`}>
                  <div className={styled.actions__icon} onClick={toggleLike}>
                    {liked ? <FaHeart /> : <FaRegHeart />}
                  </div>
                </div>
                <div
                  className={`${styled.bookmarkBox} ${
                    bookmark && styled.bookmark
                  }`}
                >
                  <div
                    className={styled.actions__icon}
                    onClick={toggleBookmark}
                  >
                    {bookmark ? <FaBookmark /> : <FaRegBookmark />}
                  </div>
                </div>
              </div>
            </nav>
          </div>
          {userObj.email === tweetObj.email && isEditing && (
            <EditTweetModal
              userObj={userObj}
              creatorInfo={creatorInfo}
              reTweetsObj={reTweetsObj}
              tweetObj={tweetObj}
              newTweet={newTweet}
              setNewTweet={setNewTweet}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              tweetAttachment={tweetObj.attachmentUrl}
            />
          )}
          {replyModal && (
            <ReplyModal
              replyModal={replyModal}
              setReplyModal={setReplyModal}
              creatorInfo={creatorInfo}
              tweetObj={tweetObj}
              userObj={userObj}
              loading={loading}
              toggleReplyModal={toggleReplyModal}
            />
          )}
        </>
      )}
    </>
  );
}
