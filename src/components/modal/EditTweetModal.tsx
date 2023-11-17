import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "./EditTweetModal.module.scss";
import Modal from "@mui/material/Modal";
import { GrEmoji, GrClose } from "react-icons/gr";
import Picker from "emoji-picker-react";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function EditTweetModal({
  creatorInfo,
  newTweet,
  setNewTweet,
  tweetAttachment,
  reTweetsObj,
  tweetObj,
  userObj,
  setIsEditing,
  isEditing,
}: any) {
  const editRef = useRef<any>();
  const emojiRef = useRef<any>();
  const [filterReTweetId, setFilterReTweetId] = useState<any>({});
  const [select, setSelect] = useState("");
  const t = useTranslation();

  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick({ emojiRef });

  // 수정된 글 firebase에 업데이트
  useEffect(() => {
    // 답글
    const index = reTweetsObj?.findIndex(
      (obj: any) => obj?.replyId === tweetObj?.id
    );
    setFilterReTweetId(reTweetsObj[index]);
  }, [tweetObj.id, reTweetsObj, userObj.email]);

  const onChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };

  const onSubmit = async (e: any) => {
    alert("업데이트 되었습니다");
    e.preventDefault();

    if (tweetObj?.parent) {
      // 답글 업뎃
      const repliesRef = doc(db, "Replies", tweetObj.id);
      await updateDoc(repliesRef, {
        text: newTweet,
        attachmentUrl: tweetObj.attachmentUrl,
      });
    } else {
      // 원글 업뎃
      const tweetsRef = doc(db, "Tweets", tweetObj.id);
      await updateDoc(tweetsRef, {
        text: newTweet,
        attachmentUrl: tweetObj.attachmentUrl,
      });
    }

    if (filterReTweetId) {
      const reTweetRef = doc(db, "ReTweets", filterReTweetId.id);
      await updateDoc(reTweetRef, {
        text: newTweet,
      });
    }

    setIsEditing(false);
  };

  const onEmojiClick = (event: any) => {
    const textEmoji =
      newTweet.slice(0, editRef.current.selectionStart) +
      event.emoji +
      newTweet.slice(editRef.current.selectionEnd, newTweet.length);
    setNewTweet(textEmoji);
  };

  return (
    <Modal
      open={isEditing}
      onClose={() => setIsEditing(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <form className={styled.editForm} onSubmit={onSubmit}>
          <div className={styled.topBox}>
            <div className={styled.close} onClick={() => setIsEditing(false)}>
              {/* onClick={toggleEdit}> */}
              <GrClose />
            </div>
            <div className={styled.submit}>
              <input
                type="submit"
                value={t("BUTTON_EDIT")}
                className={styled.editInput__arrow}
                disabled={newTweet === "" && tweetAttachment === ""}
              />
            </div>
          </div>
          <div className={styled.editInput__container}>
            <div className={styled.tweet__profile}>
              <img
                src={
                  creatorInfo.photoURL
                    ? creatorInfo.photoURL
                    : PROFILE_DEFAULT_URL
                }
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.editInput}>
              <div
                className={`${styled.editForm__content} ${
                  select === "text" && styled.focus
                }`}
              >
                <textarea
                  spellCheck="false"
                  className={styled.editInput__input}
                  value={newTweet}
                  ref={editRef}
                  onChange={onChange}
                  onFocus={() => setSelect("text")}
                  onBlur={() => setSelect("")}
                  maxLength={280}
                  placeholder={t("TWEET_PLACEHOLDER")}
                />
                <div className={styled.editInput__add}>
                  <div ref={emojiRef} onClick={toggleEmoji}>
                    <div className={styled.editInput__emoji}>
                      <GrEmoji />
                    </div>
                    {clickEmoji && (
                      <div
                        className={`${styled.emoji} 
                    ${clickEmoji ? styled.emoji__block : styled.emoji__hidden}
                  `}
                      >
                        <Picker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {tweetAttachment && (
                <div className={styled.editForm__attachment}>
                  <img
                    src={tweetAttachment}
                    alt="upload file"
                    style={{
                      backgroundImage: tweetAttachment,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
