import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "firebaseApp";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { TweetProps } from "pages/home";
import { EditFormProps } from "components/tweets/TweetEditForm";

import Picker from "emoji-picker-react";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import BarLoader from "components/loader/BarLoader";
import styled from "../tweets/TweetForm.module.scss";

import { GrEmoji } from "react-icons/gr";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";

import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "context/AuthContext";
import useTranslation from "hooks/useTranslation";
import { ReplyProps } from "components/reply/ReplyBox";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function ReplyEditForm({
  detailId,
  editModal,
  setEditModal,
}: EditFormProps) {
  const [reply, setReply] = useState<ReplyProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [progressBarCount, setProgressBarCount] = useState<number>(0);

  const [select, setSelect] = useState("");
  const fileInput = useRef<any>();
  const textRef = useRef<any>();
  const emojiRef = useRef<any>();

  // 이모지 모달 밖 클릭 시 창 끔
  // const { clickEmoji, toggleEmoji } = useEmojiModalOutClick(emojiRef);

  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const getReply = useCallback(async () => {
    if (detailId) {
      const docRef = doc(db, "Replies", detailId);
      const docSnap = await getDoc(docRef);
      setReply({ ...(docSnap?.data() as ReplyProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [detailId]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setProgressBarCount(0); // 프로그레스 바 초기화

    //파일 경로 참조 만들기
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    // 입력 값 없을 시 업로드 X
    if (content !== "") {
      const editReply = async () => {
        try {
          if (reply) {
            // 기존 사진 지우고 새로운 사진 업로드
            if (reply?.imageUrl) {
              let imageRef = ref(storage, reply?.imageUrl);
              await deleteObject(imageRef).catch((error) => {
                console.log(error);
              });
            }

            // 새로운 파일 있다면 업로드
            let imageUrl = "";

            if (imageFile) {
              console.log("imageFile", imageFile, "imageFile", imageUrl);
              const data = await uploadString(
                storageRef,
                imageFile,
                "data_url"
              );
              imageUrl = await getDownloadURL(data?.ref);
            }

            const replyRef = doc(db, "Replies", reply?.id);
            await updateDoc(replyRef, {
              content: content,
              imageUrl: imageUrl,
            });
            toast.success(t("EDIT_TWEET_TOAST"));
            setImageFile(null);
          }

          if (!editModal) {
            if (textRef.current) textRef.current.style.height = "52px";
          } else {
            setEditModal(false);
          }
        } catch (e: any) {
          console.log("form error", e);
        }
      };

      let start = 0;
      const interval = setInterval(() => {
        if (start <= 100) {
          setProgressBarCount((prev) => (prev === 100 ? 100 : prev + 1));
          start++; // progress 증가
        }
        if (start === 100) {
          editReply();
          return;
        }
      });

      return () => {
        clearInterval(interval);
      };
    } else {
      toast.error(t("SUBMIT_ERROR_TOAST"));
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  const onEmojiClick = (event: any) => {
    const textEmoji =
      content.slice(0, textRef.current?.selectionStart) +
      event.emoji +
      content.slice(textRef.current?.selectionEnd, content.length);
    setContent(textEmoji);
  };

  useEffect(() => {
    if (detailId) getReply();
  }, [getReply, detailId]);

  return (
    <>
      {progressBarCount !== 0 && <BarLoader count={progressBarCount} />}
      <div className={`${styled.tweetForm} ${editModal && styled.modalBorder}`}>
        <div className={styled.tweetInput__container}>
          <div className={styled.tweet__profile}>
            {user && (
              <img
                src={user?.photoURL || PROFILE_DEFAULT_URL}
                alt="profileImg"
                className={styled.profile__image}
              />
            )}
          </div>
          <form className={styled.tweetInput} onSubmit={onSubmit}>
            <div
              className={`${styled.tweetForm__content} ${
                select === "text" && styled.focus
              }`}
            >
              <textarea
                className={styled.tweetInput__input}
                spellCheck="false"
                value={content}
                ref={textRef}
                name="content"
                id="content"
                required
                placeholder={t("TWEET_PLACEHOLDER")}
                onChange={onChange}
                onFocus={() => setSelect("text")}
                onBlur={() => setSelect("")}
                maxLength={280}
              />
              {/* <div
                className={`${styled.tweetInput__hashtags} ${
                  select === "hashtag" && styled.focus
                }`}
              >
                {tags.length !== 0 ? (
                  <span className={styled.tweetInput__hashtags_outputs}>
                    {tags?.map((tag, index) => (
                      <span
                        className={styled.tweetInput__hashtags_tag}
                        key={index}
                        onClick={() => removeTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </span>
                ) : null}
                <input
                  className={styled.tweetInput__hashtags_input}
                  name="hashtag"
                  id="hashtag"
                  placeholder={t("TWEET_HASHTAG")}
                  onChange={onChangeHashTag}
                  onKeyUp={handleKeyUp}
                  value={hashTag}
                  onFocus={() => setSelect("hashtag")}
                  onBlur={() => setSelect("")}
                />
              </div> */}

              {imageFile && (
                <div className={styled.tweetForm__attachment}>
                  <div className={styled.tweetForm__Image}>
                    <img
                      src={imageFile}
                      alt="upload file"
                      style={{
                        backgroundImage: imageFile,
                      }}
                    />
                  </div>
                  <div
                    className={styled.tweetForm__clear}
                    onClick={handleDeleteImage}
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              )}
            </div>
            <div className={styled.tweetInput__add}>
              <div className={styled.tweetInput__iconBox}>
                <label
                  htmlFor={editModal ? "modal-attach-file" : "attach-file"}
                  className={styled.tweetInput__label}
                >
                  <div className={styled.tweetInput__icon}>
                    <IoImageOutline />
                  </div>
                </label>
                <input
                  ref={fileInput}
                  id={editModal ? "modal-attach-file" : "attach-file"}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              {/* <div
                ref={emojiRef}
                onClick={toggleEmoji}
                className={styled.tweetInput__iconBox}
              >
                <div
                  className={`${styled.tweetInput__icon} ${styled.emoji__icon}`}
                >
                  <GrEmoji />
                </div>
                해결: clickEmoji이 true일 때만 실행해서textarea 버벅이지 않음
                {clickEmoji && (
                  <div
                    className={`${styled.emoji} 
                    ${clickEmoji ? styled.emoji__block : styled.emoji__hidden}
                  `}
                  >
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div> */}
              <input
                type="submit"
                value={t("BUTTON_EDIT")}
                className={styled.tweetInput__arrow}
                disabled={content === "" && imageFile === ""}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
