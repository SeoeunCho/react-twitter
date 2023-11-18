import { useRef, useState } from "react";
import { TweetProps } from "pages/home";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";

import Picker from "emoji-picker-react";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import BarLoader from "components/loader/BarLoader";
import styled from "./ReplyForm.module.scss";
import useTranslation from "hooks/useTranslation";
import { BsReplyFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { languageState } from "atom";
import { useRecoilState } from "recoil";
import imageCompression from "browser-image-compression";
import useGetFbInfo from "hooks/useGetFbInfo";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export interface ReplyPropsBox {
  tweet: TweetProps;
  replyModal: boolean;
  setReplyModal: any;
}

export default function ReplyForm({
  userObj,
  tweetObj,
  replyModal,
  setReplyModal,
}: any) {
  const [reply, setReply] = useState<string>("");
  const [progressBarCount, setProgressBarCount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const [select, setSelect] = useState<string>("");
  const fileInput = useRef<any>();
  const textRef = useRef<any>();
  const emojiRef = useRef<any>();

  // 이모지 모달 밖 클릭 시 창 끔
  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick({ emojiRef });
  const { myInfo } = useGetFbInfo();

  // const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const t = useTranslation();
  const language = useRecoilState(languageState);

  const truncate = (str: string) => {
    return str?.length > 10 ? str?.substring(0, 10) + "..." : str;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setProgressBarCount(0); // 프로그레스 바 초기화
    let imageUrl = "";

    // 입력 값 없을 시 업로드 X
    if (reply !== "") {
      // 이미지 있을 때만 첨부
      if (imageUrl !== "") {
        //파일 경로 참조 만들기
        const key = `${userObj?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);

        //storage 참조 경로로 파일 업로드 하기
        await uploadString(storageRef, imageUrl, "data_url");

        // storage 참조 경로에 있는 파일의 URL을 다운로드해서 imageUrl 변수에 넣어서 업데이트
        imageUrl = await getDownloadURL(ref(storageRef));
      }

      const tweetReply = {
        text: reply,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        email: userObj.email,
        imageUrl,
        like: [],
        reTweet: [],
        reTweetAt: [],
        parent: tweetObj.id,
        parentEmail: tweetObj.email,
        replyId: [],
        reTweetEmail: [],
        isReply: true,
      };

      /* 하위 컬렉션 생성하기
        const tweetRef = doc(collection(db, "Tweets", tweet?.id, "Replies"));
        setDoc(tweetRef, replyObj)*/

      /** 답글 컬렉션 생성 */
      const addReply = async () => {
        const replies = await addDoc(collection(db, "Replies"), tweetReply);

        await updateDoc(doc(db, "Tweets", tweetObj.id), {
          replyId: [...tweetObj?.replyId, replies.id],
        })
          .then(() => {
            toast.success(t("ADD_REPLY_TOAST"));
            setReply("");
            setSelect("");
            setImageUrl("");
            setProgressBarCount(0); // 프로그레스 바 초기화

            if (!replyModal) {
              textRef.current.style.height = "52px";
            } else {
              setReplyModal(false);
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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "reply") {
      setReply(value);
    }
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
    const compressedImage: any = await compressImage(file); // 이미지 압축
    const fileReader = new FileReader(); // 파일 이름 읽기

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
        Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (file) {
      fileReader?.readAsDataURL(compressedImage);
    }

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl("");
    fileInput.current.value = ""; // 취소 시 파일 문구 없애기
  };

  const goPage = () => {
    navigate("/profile/mytweets/" + tweetObj.email);
  };

  const onEmojiClick = (event: any) => {
    const textEmoji =
      reply.slice(0, textRef.current?.selectionStart) +
      event.emoji +
      reply.slice(textRef.current?.selectionEnd, reply.length);
    setReply(textEmoji);
    setSelect("");
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
          <p onClick={goPage}>@{tweetObj.email?.split("@")[0]}</p>
          {language[0] === "ko" && <p>&nbsp;{t("REPLY_TO")}</p>}
        </div>
      </div>
      <div
        className={`${styled.replyForm} ${replyModal && styled.modalBorder}`}
      >
        <div className={styled.replyInput__container}>
          <div className={styled.tweet__profile}>
            <img
              src={myInfo?.photoURL || PROFILE_DEFAULT_URL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <form onSubmit={onSubmit} className={styled.replyInput}>
            <div
              className={`${styled.replyForm__content} ${
                select === "text" && styled.focus
              }`}
            >
              <textarea
                className={styled.replyInput__input}
                spellCheck="false"
                value={reply}
                ref={textRef}
                name="reply"
                id="reply"
                required
                onChange={onChange}
                onFocus={() => setSelect("text")}
                maxLength={280}
                placeholder={t("REPLY_PLACEHOLDER")}
              />
              {imageUrl && (
                <div className={styled.replyForm__attachment}>
                  <div className={styled.replyForm__Image}>
                    <img
                      src={imageUrl}
                      alt="upload file"
                      style={{
                        backgroundImage: imageUrl,
                      }}
                    />
                  </div>
                  <div
                    className={styled.replyForm__clear}
                    onClick={handleDeleteImage}
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              )}
            </div>
            <div className={styled.replyInput__add}>
              <div className={styled.replyInput__iconBox}>
                <label
                  htmlFor="reply-attach-file"
                  className={styled.replyInput__label}
                >
                  <div className={styled.replyInput__icon}>
                    <IoImageOutline />
                  </div>
                </label>
                <input
                  ref={fileInput}
                  id="reply-attach-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              <div
                ref={emojiRef}
                onClick={toggleEmoji}
                className={styled.replyInput__iconBox}
              >
                <div
                  className={`${styled.replyInput__icon} ${styled.emoji__icon}`}
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
                className={styled.replyInput__arrow}
                disabled={reply === "" && imageUrl === ""}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
