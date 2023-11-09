import { useContext, useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FiImage } from "react-icons/fi";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import { db, storage } from "firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import useTranslation from "hooks/useTranslation";
import useEmojiModalOutClick from "../../hooks/useEmojiModalOutClick";
import BarLoader from "components/loader/BarLoader";
import styled from "./PostForm.module.scss";
import { GrEmoji } from "react-icons/gr";
import { RiHashtag } from "react-icons/ri";
import Picker from "emoji-picker-react";
const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function PostForm({ setXweetModal, xweetModal }: any) {
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>("");
  const [tags, setTags] = useState<string[]>([]);
  const [progressBarCount, setProgressBarCount] = useState<number>(0);
  const [randomCount, setRandomCount] = useState<number>(1);
  const [select, setSelect] = useState("");
  const fileInput = useRef<any>();
  const textRef = useRef<any>();
  const emojiRef = useRef<any>();

  // 이모지 모달 밖 클릭 시 창 끔
  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick({ emojiRef });

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

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);

    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    setProgressBarCount(0); // 프로그레스 바 초기화

    if (content !== "") {
      // 이미지 먼저 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }

      const addXweet = async () => {
        setRandomCount((prev) => prev++);
        // 업로드된 이미지의 download url 업데이트
        await addDoc(collection(db, "posts"), {
          content: content,
          createdAt: Date.now(),
          uid: user?.uid,
          profileUrl: user?.photoURL,
          email: user?.email,
          hashTags: tags,
          imageUrl: imageUrl,
          displayName: user?.displayName,
        })
          .then(() => {
            setTags([]);
            setHashTag("");
            setContent("");
            toast.success(t("UPDATE_POST_TOAST"));
            setImageFile(null);
            setIsSubmitting(false);
            setProgressBarCount(0); // 프로그레스 바 초기화
            if (!xweetModal) {
              if (textRef.current) textRef.current.style.height = "52px";
            } else {
              setXweetModal(false);
            }
          })
          .catch((e: any) => {
            // 에러 처리
            console.log(e);
            setProgressBarCount(0); // 프로그레스 바 초기화
            clearInterval(interval);
          });
      };

      let start = 0;
      const interval = setInterval(() => {
        if (start <= 100) {
          setProgressBarCount((prev) => (prev === 100 ? 100 : prev + 1));
          start++; // progress 증가
        }
        if (start === 100) {
          addXweet().then(() => {
            clearInterval(interval);
          });
        }
      });
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
        toast.error(t("SAME_TAG_TOAST"));
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  const handleDeleteImage = () => {
    setImageFile("");
    fileInput.current.value = ""; // 취소 시 파일 문구 없애기
  };

  const onEmojiClick = (event: any) => {
    const textEmoji =
      content.slice(0, textRef.current?.selectionStart) +
      event.emoji +
      content.slice(textRef.current?.selectionEnd, content.length);
    setContent(textEmoji);
  };

  return (
    <>
      {progressBarCount !== 0 && <BarLoader count={progressBarCount} />}
      <div className={`${styled.postForm} ${xweetModal && styled.modalBorder}`}>
        <div className={styled.postInput__container}>
          <div className={styled.xweet__profile}>
            {user && (
              <img
                src={user?.photoURL || PROFILE_DEFAULT_URL}
                alt="profileImg"
                className={styled.profile__image}
              />
            )}
          </div>
          <form className={styled.postInput} onSubmit={onSubmit}>
            <div
              className={`${styled.postForm__content} ${
                select === "text" && styled.focus
              }`}
            >
              <textarea
                className={styled.postInput__input}
                spellCheck="false"
                value={content}
                ref={textRef}
                name="content"
                id="content"
                placeholder={t("POST_PLACEHOLDER")}
                onChange={onChange}
                onFocus={() => setSelect("text")}
                onBlur={() => setSelect("")}
                maxLength={280}
              />
              <div
                className={`${styled.postInput__hashtags} ${
                  select === "hashtag" && styled.focus
                }`}
              >
                {tags.length !== 0 ? (
                  <span className={styled.postInput__hashtags_outputs}>
                    {tags?.map((tag, index) => (
                      <span
                        className={styled.postInput__hashtags_tag}
                        key={index}
                        onClick={() => removeTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </span>
                ) : null}
                <input
                  className={styled.postInput__hashtags_input}
                  name="hashtag"
                  id="hashtag"
                  placeholder={t("POST_HASHTAG")}
                  onChange={onChangeHashTag}
                  onKeyUp={handleKeyUp}
                  value={hashTag}
                  onFocus={() => setSelect("hashtag")}
                  onBlur={() => setSelect("")}
                />
              </div>

              {imageFile && (
                <div className={styled.postForm__attachment}>
                  <div className={styled.postForm__Image}>
                    <img
                      src={imageFile}
                      alt="upload file"
                      style={{
                        backgroundImage: imageFile,
                      }}
                    />
                  </div>
                  <div
                    className={styled.postForm__clear}
                    onClick={handleDeleteImage}
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              )}
            </div>
            <div className={styled.postInput__add}>
              <div className={styled.postInput__iconBox}>
                <label
                  htmlFor={xweetModal ? "modal-attach-file" : "attach-file"}
                  className={styled.postInput__label}
                >
                  <div className={styled.postInput__icon}>
                    <IoImageOutline />
                  </div>
                </label>
                <input
                  ref={fileInput}
                  id={xweetModal ? "modal-attach-file" : "attach-file"}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              <div
                ref={emojiRef}
                onClick={toggleEmoji}
                className={styled.postInput__iconBox}
              >
                <div
                  className={`${styled.postInput__icon} ${styled.emoji__icon}`}
                >
                  <GrEmoji />
                </div>
                {/* 해결: clickEmoji이 true일 때만 실행해서textarea 버벅이지 않음 */}
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
              <input
                type="submit"
                value={t("BUTTON_TWEET")}
                className={styled.postInput__arrow}
                disabled={content === "" && imageFile === ""}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
