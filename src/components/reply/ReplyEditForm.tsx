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
import { PostProps } from "pages/home";
import { EditFormProps } from "components/posts/PostEditForm";

import Picker from "emoji-picker-react";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import BarLoader from "components/loader/BarLoader";
import styled from "../posts/PostForm.module.scss";

import { GrEmoji } from "react-icons/gr";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";

import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "context/AuthContext";
import useTranslation from "hooks/useTranslation";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function ReplyEditForm({
  detailId,
  editModal,
  setEditModal,
}: EditFormProps) {
  const [post, setPost] = useState<PostProps | null>(null);
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

  console.log("post", post);

  const getPost = useCallback(async () => {
    if (detailId) {
      const docRef = doc(db, "Posts", detailId);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
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
      const editPost = async () => {
        try {
          if (post) {
            // 기존 사진 지우고 새로운 사진 업로드
            if (post?.imageUrl) {
              let imageRef = ref(storage, post?.imageUrl);
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

            const postRef = doc(db, "Posts", post?.id);
            await updateDoc(postRef, {
              content: content,
              hashTags: tags,
              imageUrl: imageUrl,
            });
            toast.success(t("EDIT_POST_TOAST"));
            // setImageFile(null);
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
          editPost();
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
    if (detailId) getPost();
  }, [getPost, detailId]);

  return (
    <>
      {progressBarCount !== 0 && <BarLoader count={progressBarCount} />}
      <div className={`${styled.postForm} ${editModal && styled.modalBorder}`}>
        <div className={styled.postInput__container}>
          <div className={styled.tweet__profile}>
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
                required
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
                  htmlFor={editModal ? "modal-attach-file" : "attach-file"}
                  className={styled.postInput__label}
                >
                  <div className={styled.postInput__icon}>
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
                value={t("BUTTON_EDIT")}
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
