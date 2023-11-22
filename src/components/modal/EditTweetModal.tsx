import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import styled from "./EditTweetModal.module.scss";
import Modal from "@mui/material/Modal";
import { v4 as uuidv4 } from "uuid";
import { GrEmoji, GrClose } from "react-icons/gr";
import Picker from "emoji-picker-react";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import { db, storage } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { toast } from "react-toastify";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import imageCompression from "browser-image-compression";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";

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
  const editRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [filterReTweetId, setFilterReTweetId] = useState<any>({});
  const [attachment, setAttachment] = useState<string>(tweetAttachment);
  const [select, setSelect] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>(tweetObj?.hashTags);

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
    e.preventDefault();
    const imgUid = uuidv4();
    const key = `${tweetObj?.creatorId}/${imgUid}`;
    const storageRef = ref(storage, key);
    let imageUrl = "";

    // 이미지 미변경
    if (attachment === tweetObj.attachmentUrl) {
      imageUrl = tweetObj.attachmentUrl;
    } else {
      let imageRef = ref(storage, `${tweetObj?.attachmentUrl}`);
      // 이미지 삭제했을때
      if (attachment === "") {
        // 기존 이미지 스토리지 삭제
        await deleteObject(imageRef)
          .then(() => {
            imageUrl = "";
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // 이미지 변경했을때
        // 기존 이미지 스토리지 삭제
        if (tweetObj.attachmentUrl !== "") {
          let imageRef2 = ref(
            storage,
            `${tweetObj?.creatorId}/${tweetObj?.imgUid}`
          );
          await deleteObject(imageRef2).catch((error) => {
            console.log(error);
          });
        }
        // 새로운 파일 있다면 업로드
        await uploadString(storageRef, attachment, "data_url");
        imageUrl = await getDownloadURL(ref(storageRef));
      }
    }

    if (tweetObj?.parent) {
      // 답글 업뎃
      const repliesRef = doc(db, "Replies", tweetObj.id);
      await updateDoc(repliesRef, {
        text: newTweet,
        attachmentUrl: imageUrl,
        imgUid: imageUrl ? imgUid : "",
        hashTags: tags,
      });
      toast.success(t("EDIT_REPLY_TOAST"));
    } else {
      // 원글 업뎃
      const tweetsRef = doc(db, "Tweets", tweetObj.id);
      await updateDoc(tweetsRef, {
        text: newTweet,
        attachmentUrl: imageUrl,
        imgUid: imageUrl ? imgUid : "",
        hashTags: tags,
      });
      toast.success(t("EDIT_TWEET_TOAST"));
    }

    if (filterReTweetId) {
      const reTweetRef = doc(db, "ReTweets", filterReTweetId.id);
      await updateDoc(reTweetRef, {
        text: newTweet,
      });
    }

    setIsEditing(false);
  };

  const handleDeleteImage = () => {
    setAttachment("");
    if (fileInput.current) fileInput.current.value = ""; // 취소 시 파일 문구 없애기
  };

  // 이미지 압축
  const compressImage = async (image: any) => {
    try {
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 800,
      };
      return await imageCompression(image, options);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (e: any) => {
    const {
      target: { files },
    } = e;
    const file = files?.[0]; // 파일 1개만 첨부
    const compressedImage = await compressImage(file); // 이미지 압축
    const fileReader = new FileReader(); // 파일 이름 읽기

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
    Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (file && compressedImage) {
      fileReader.readAsDataURL(compressedImage);
    }

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setAttachment(result);
    };
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value.trim());
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      // 만약 같은 태그가 있다면 에러를 띄운다
      // 태그를 생성해준다
      if (tags?.includes(e.target.value?.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  const onEmojiClick = (event: any) => {
    const textEmoji =
      newTweet.slice(0, editRef?.current?.selectionStart) +
      event.emoji +
      newTweet.slice(editRef?.current?.selectionEnd, newTweet.length);
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
              <GrClose />
            </div>
            <div className={styled.submit}>
              <input
                type="submit"
                value={t("BUTTON_EDIT")}
                className={styled.editInput__arrow}
                disabled={newTweet === "" && attachment === ""}
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
              <div className={`${select === "text" && styled.focus}`}>
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
                <div className={styled.editInput__hashtags}>
                  {tags.length !== 0 ? (
                    <span className={styled.editInput__hashtags_outputs}>
                      {tags?.map((tag, index) => (
                        <span
                          className={styled.editInput__hashtags_tag}
                          key={index}
                          onClick={() => removeTag(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </span>
                  ) : null}
                  <input
                    className={styled.editInput__hashtags__input}
                    name="hashtag"
                    id="hashtag"
                    placeholder={t("TWEET_HASHTAG")}
                    onChange={onChangeHashTag}
                    onKeyUp={handleKeyUp}
                    value={hashTag}
                    onFocus={() => setSelect("hashtag")}
                    onBlur={() => setSelect("")}
                  />
                </div>
              </div>

              <div className={styled.editInput__add}>
                <div className={styled.editInput__iconBox}>
                  <label
                    htmlFor="modal-attach-file"
                    className={styled.editInput__label}
                  >
                    <div className={styled.editInput__icon}>
                      <IoImageOutline />
                    </div>
                  </label>
                  <input
                    ref={fileInput}
                    id="modal-attach-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                <div
                  ref={emojiRef}
                  onClick={toggleEmoji}
                  className={styled.editInput__iconBox}
                >
                  <div
                    className={`${styled.editInput__icon} ${styled.emoji__icon}`}
                  >
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

              {/* 이미지 컨텐츠 */}
              {attachment && (
                <div className={styled.editForm__attachment}>
                  <div className={styled.editForm__image}>
                    <img
                      src={attachment}
                      alt="upload file"
                      style={{
                        backgroundImage: attachment,
                      }}
                    />
                  </div>
                  <div
                    className={styled.editForm__clear}
                    onClick={handleDeleteImage}
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
