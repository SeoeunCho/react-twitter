import { useCallback, useRef, useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import styled from "./DetailReplyForm.module.scss";
import { useNavigate } from "react-router-dom";
import { db, storage } from "firebaseApp";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import useGetFbInfo from "hooks/useGetFbInfo";
import BarLoader from "components/loader/BarLoader";
import useTranslation from "hooks/useTranslation";
import { languageState } from "atom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { BsReplyFill } from "react-icons/bs";

export default function DetailReplyForm({
  userObj,
  tweetObj,
  replyModal,
  setReplyModal,
}: any) {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const [reply, setReply] = useState<string>("");
  const [attachment, setAttachment] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [select, setSelect] = useState<string>("");
  const [progressBarCount, setProgressBarCount] = useState<number>(0);

  // 이모지 모달 밖 클릭 시 창 끔
  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick({ emojiRef });
  const { myInfo } = useGetFbInfo();
  const t = useTranslation();
  const language = useRecoilState(languageState);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let attachmentUrl = "";
    let start = 0;
    const imgUid = uuidv4();
    setProgressBarCount(0); // 프로그레스 바 초기화
    // 입력 값 없을 시 업로드 X
    if (reply !== "") {
      // 이미지 있을 때만 첨부
      if (attachment !== "") {
        //파일 경로 참조 만들기
        const key = `${userObj?.uid}/${imgUid}`;
        const attachmentfileRef = ref(storage, key);

        //storage 참조 경로로 파일 업로드 하기
        await uploadString(attachmentfileRef, attachment, "data_url");

        //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
        attachmentUrl = await getDownloadURL(ref(attachmentfileRef));
      }

      const tweetReply = {
        text: reply,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        email: userObj.email,
        attachmentUrl,
        like: [],
        reTweet: [],
        reTweetAt: [],
        parent: tweetObj.id,
        parentEmail: tweetObj.email,
        replyId: [],
        reTweetEmail: [],
        isReply: true,
        imgUid: attachment ? imgUid : "",
        hashTags: tags,
      };

      const addReply = async () => {
        const replies = await addDoc(collection(db, "Replies"), tweetReply);
        await updateDoc(doc(db, "Tweets", tweetObj.id), {
          replyId: [...tweetObj?.replyId, replies.id],
        });

        setReply("");
        setTags([]);
        setHashTag("");
        setAttachment("");
        setSelect("");
        setProgressBarCount(0); // 프로그레스 바 초기화
        if (!replyModal && textRef.current) {
          textRef.current.style.height = "52px";
        } else {
          setReplyModal(false);
        }
      };

      const interval = setInterval(() => {
        if (start <= 100) {
          setProgressBarCount((prev) => (prev === 100 ? 100 : prev + 1));
          start++; // progress 증가
        }
        if (start === 100) {
          addReply();
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

  const onChange = useCallback((e: any) => {
    setReply(e.target.value);
  }, []);

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

  const onFileChange = async (e: any) => {
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

  const onClearAttachment = () => {
    setAttachment("");
    if (fileInput.current) fileInput.current.value = ""; // 취소 시 파일 문구 없애기
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

  const goPage = (e: any) => {
    e.stopPropagation();
    navigate("/profile/mytweets/" + tweetObj.email);
  };

  const onEmojiClick = (event: any) => {
    const textEmoji =
      reply.slice(0, textRef?.current?.selectionStart) +
      event.emoji +
      reply.slice(textRef?.current?.selectionEnd, reply.length);
    setReply(textEmoji);
  };

  return (
    <>
      {progressBarCount !== 0 && <BarLoader count={progressBarCount} />}
      <div
        className={`${styled.tweet__reply} ${
          select === "text" && styled.select
        } `}
      >
        <div className={styled.tweet__replyIcon}>
          <BsReplyFill />
        </div>
        <div className={styled.tweet__replyText}>
          {language[0] === "en" && <p>{t("REPLY_TO")}&nbsp;</p>}
          <p onClick={goPage}>@{tweetObj?.email?.split("@")[0]}</p>
          {language[0] === "ko" && <p>&nbsp;{t("REPLY_TO")}</p>}
        </div>
      </div>
      <div
        className={`${styled.factoryForm} ${replyModal && styled.modalBorder}`}
      >
        <div className={styled.factoryInput__container}>
          <div className={styled.tweet__profile}>
            <img
              src={myInfo?.photoURL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <form onSubmit={onSubmit} className={styled.factoryInput}>
            <div className={`${select === "text" && styled.focus}`}>
              <textarea
                spellCheck="false"
                className={styled.factoryInput__input}
                value={reply}
                ref={textRef}
                onChange={onChange}
                onFocus={() => setSelect("text")}
                maxLength={280}
                placeholder={t("REPLY_PLACEHOLDER")}
              />

              {/* 해쉬태그 */}
              <div
                className={`${styled.factoryInput__hashtags} ${
                  select === "hashtag" && styled.focus
                }`}
              >
                {tags.length !== 0 ? (
                  <span className={styled.factoryInput__hashtags_outputs}>
                    {tags?.map((tag, index) => (
                      <span
                        className={styled.factoryInput__hashtags_tag}
                        key={index}
                        onClick={() => removeTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </span>
                ) : null}
                <input
                  className={styled.factoryInput__hashtags_input}
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
            <div className={styled.factoryInput__add}>
              <div className={styled.factoryInput__iconBox}>
                <label
                  htmlFor="reply-attach-file"
                  className={styled.factoryInput__label}
                >
                  <div className={styled.factoryInput__icon}>
                    <IoImageOutline />
                  </div>
                </label>
                <input
                  ref={fileInput}
                  id="reply-attach-file"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>
              <div
                ref={emojiRef}
                onClick={toggleEmoji}
                className={styled.factoryInput__iconBox}
              >
                <div
                  className={`${styled.factoryInput__icon} ${styled.emoji__icon}`}
                >
                  <GrEmoji />
                </div>
                {/* 해결: clickEmoji이 true일 때만 실행해서textarea 버벅이지 않음 */}
                {clickEmoji && (
                  <div
                    className={`${styled.emoji} ${
                      clickEmoji ? styled.emoji__block : styled.emoji__hidden
                    }`}
                  >
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <input
                type="submit"
                value={t("BUTTON_REPLY")}
                className={styled.factoryInput__arrow}
                disabled={reply === "" && attachment === ""}
              />
            </div>

            {/* 이미지 컨텐츠 */}
            {attachment && (
              <div className={styled.factoryForm__attachment}>
                <div className={styled.factoryForm__Image}>
                  <img
                    src={attachment}
                    alt="upload file"
                    style={{
                      backgroundImage: attachment,
                    }}
                  />
                </div>
                <div
                  className={styled.factoryForm__clear}
                  onClick={onClearAttachment}
                >
                  <IoCloseSharp />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
