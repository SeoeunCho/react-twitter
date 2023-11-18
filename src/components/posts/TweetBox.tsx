import AuthContext from "context/AuthContext";
import { TweetProps } from "pages/home";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiRepeat, FiMoreHorizontal } from "react-icons/fi";
import { toast } from "react-toastify";

import { ReplyProps } from "components/reply/ReplyBox";
import FollowingBox from "components/following/FollowingBox";
import TweetEditDeleteBtn from "components/buttons/TweetEditDeleteBtn";
import ReplyModal from "components/modal/ReplyModal";
import EditTweetModal from "components/modal/EditTweetModal";
import styled from "./TweetBox.module.scss";

import { useSelector } from "react-redux";
import { languageState } from "atom";
import { useRecoilState } from "recoil";
import { useTimeToString } from "hooks/useTimeToString";
import { useToggleBookmark } from "hooks/useToggleBookmark";
import useToggleLike from "hooks/useToggleLike";
import useTranslation from "hooks/useTranslation";
import useHandleOutsideClick from "hooks/useHandleOutsideClick";

// import { UserProps } from "Router";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

interface TweetBoxProps {
  loading: boolean;
  // userObj: UserProps;
  tweetObj: TweetProps;
  creatorInfo: any;
  reTweetsObj: any;
  reTweet: string;
  setReTweet: string;
  toggleReTweet: boolean;
  isOwner: boolean;
}

export default function TweetBox({
  loading,
  userObj,
  tweetObj,
  creatorInfo,
  reTweetsObj,
  reTweet,
  setReTweet,
  toggleReTweet,
  isOwner,
}: any) {
  // const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [tweetEditDelBtn, setTweetEditDelBtn] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [replyModal, setReplyModal] = useState<boolean>(false);
  // const [detailTweet, setDetailTweet] = useState<boolean>(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text); // Modal 취소 후 다시 수정 시 내용 남게
  const location = useLocation();
  const { pathname } = useLocation();
  const language = useRecoilState(languageState);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // const imageRef = ref(storage, tweet?.imageUrl);
  const editRef = useRef<any>();
  const t = useTranslation();

  // 커스텀 훅
  const { liked, setLiked, toggleLike } = useToggleLike(tweetObj);
  const { bookmark, setBookmark, toggleBookmark } = useToggleBookmark(tweetObj);
  const { timeToString } = useTimeToString();

  useHandleOutsideClick({
    ref: editRef,
    isModal: tweetEditDelBtn,
    setIsModal: setTweetEditDelBtn,
  });

  /** 수정삭제 버튼 토글 */
  const toggleEditDelBtn = () => {
    setTweetEditDelBtn((prev) => !prev);
  };

  /** 수정 모달창 토글 */
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  /** 답글 모달창 토글 */
  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
  };

  const goTweet = (e: any) => {
    e.stopPropagation();
    if (pathname.includes("tweet/") && pathname.split("/")[2]) {
      return;
    }
    if (tweetObj?.parent && !editRef?.current?.contains(e.target)) {
      navigate(`/tweet/${tweetObj.parent}`);
    } else if (!tweetObj?.parent && !editRef?.current?.contains(e.target)) {
      navigate(`/tweet/${tweetObj.id}`);
    }
  };

  const goProfile = (e: any) => {
    e.stopPropagation()
    navigate(`/profile/mytweets/${tweetObj.email}`);
  };

  useEffect(() => {
    // 좋아요 목록 중 본인 아이디 있으면 true
    const checkLiked = () => {
      const hasCurrentUserLiked = tweetObj?.like?.some(
        (info: any) => info?.email === currentUser.email
      );
      setLiked(hasCurrentUserLiked);
    };

    // 리트윗된 본인 아이디 있으면 true
    const checkReTweet = () => {
      const hasCurrentUserReTweeted = tweetObj?.reTweet?.some(
        (arr: any) => arr.email === currentUser.email
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
  }, [
    currentUser?.bookmark,
    currentUser.email,
    tweetObj.id,
    tweetObj?.like,
    tweetObj?.reTweet,
    setBookmark,
    setLiked,
    setReTweet,
  ]);

  return (
    <>
      <li className={`${styled.tweet}`}>
        {/* 리트윗 메세지 창 */}
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
        <div className={styled.tweet__wrapper} onClick={goTweet}>
          <div className={styled.tweet__container}>
            {/* 프로필 이미지 */}
            <div className={styled.tweet__profile} onClick={goProfile}>
              <img
                src={loading && (creatorInfo?.photoURL || PROFILE_DEFAULT_URL)}
                alt="profileImg"
                loading="lazy"
                className={styled.profile__image}
              />
            </div>

            {/* 유저 정보 */}
            <div className={styled.userInfo}>
              <div className={styled.userInfo__name}>
                <div
                  className={styled.userInfo__one}
                  onClick={goProfile}
                >
                  <p>{creatorInfo.displayName}</p>
                </div>
                {/* <Link
                  className={styled.userInfo__one}
                  to={`/profile/mytweets/${tweetObj.email}`}
                >
                  <p>{creatorInfo.displayName}</p>
                </Link> */}
                <div className={styled.userInfo__two}>
                  <p>
                    @{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
                  </p>
                  <p style={{ margin: "0 4px" }}>·</p>
                  <p className={styled.tweet__createdAt}>
                    {timeToString(tweetObj.createdAt)}
                  </p>
                </div>
              </div>

              {/* 팔로잉 박스 */}
              {/* <FollowingBox reply={reply} tweet={tweet} tweetType={tweetType} /> */}

              {/* 트윗 수정,삭제 버튼 */}
              {tweetObj.creatorId === userObj.uid && (
                <div className={styled.tweet__edit} ref={editRef}>
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
                      setTweetEditDelBtn={setTweetEditDelBtn}
                      toggleEdit={toggleEdit}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 컨텐츠 */}
          {tweetObj.parent && (
            <div className={`${styled.tweet__reply} ${styled.select}`}>
              <Link
                className={styled.tweet__replyText}
                to={`/profile/mytweets/${tweetObj.parentEmail}`}
              >
                {language[0] === "en" && (
                  <>
                    <p>{t("REPLY_TO")}&nbsp;</p>
                    <p>@{tweetObj.parentEmail?.split("@")[0]}</p>
                  </>
                )}

                {language[0] === "ko" && (
                  <>
                    <p>@{tweetObj.parentEmail?.split("@")[0]}</p>
                    <p>&nbsp;{t("REPLY_TO")}</p>
                  </>
                )}
              </Link>
            </div>
          )}

          <div className={styled.tweet__text}>
            <h4>{tweetObj.text}</h4>
            {/* {tweetType === "tweet" && tweet?.hashTags?.length !== 0 && (
              <div
                className={`${styled.tweet__text__hashtags} ${styled.focus}`}
              >
                <span className={styled.tweet__text__hashtags_outputs}>
                  {tweet?.hashTags?.map((tag, index) => (
                    <span
                      className={styled.tweet__text__hashtags_tag}
                      key={index}
                    >
                      #{tag}
                    </span>
                  ))}
                </span>
              </div>
            )} */}
          </div>

          {/* {tweetType === "reply" && (
              <div className={`${styled.tweet__reply} ${styled.select}`}>
                <Link
                  className={styled.tweet__replyText}
                  to={`/profile/${reply?.email}`}
                >
                  {language[0] === "en" && <p>{t("REPLY_TO")}&nbsp;</p>}
                  <p>@{tweet.email?.split("@")[0]}</p>
                  {language[0] === "ko" && <p>&nbsp;{t("REPLY_TO")}</p>}
                </Link>
              </div>
            )} */}
        </div>

        {/* 트윗 이미지 콘텐츠 */}
        {tweetObj.attachmentUrl ? (
          <div className={styled.tweet__image} onClick={goTweet}>
            <img
              src={tweetObj.attachmentUrl}
              alt="uploaded file"
              loading="lazy"
            />
          </div>
        ) : null}

        {/* 트윗 액션버튼 바 */}
        <nav className={styled.tweet__actions}>
          <div className={`${styled.actionBox} ${styled.comment}`}>
            <div className={styled.actions__icon} onClick={toggleReplyModal}>
              <FaRegComment />
            </div>
            <div className={styled.actions__text}>
              <p>
                {tweetObj.replyId?.length === 0 ? "" : tweetObj.replyId?.length}
              </p>
            </div>
          </div>
          <div className={`${styled.actionBox} ${reTweet && styled.reTweet}`}>
            <div className={styled.actions__icon} onClick={toggleReTweet}>
              <FiRepeat />
            </div>
            <div className={styled.actions__text}>
              <p>
                {tweetObj.reTweet.length === 0 ? "" : tweetObj.reTweet.length}
              </p>
            </div>
          </div>
          <div className={`${styled.actionBox} ${liked && styled.like}`}>
            <div className={styled.actions__icon} onClick={toggleLike}>
              {liked ? <FaHeart /> : <FaRegHeart />}
            </div>
            <div className={styled.actions__text}>
              <p>{tweetObj.like.length === 0 ? "" : tweetObj.like.length}</p>
            </div>
          </div>
          <div className={`${styled.actionBox} ${bookmark && styled.bookmark}`}>
            <div className={styled.actions__icon} onClick={toggleBookmark}>
              {bookmark ? <FaBookmark /> : <FaRegBookmark />}
            </div>
          </div>
        </nav>
      </li>
      {isOwner && isEditing && (
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
  );
}
