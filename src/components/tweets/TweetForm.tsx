import { useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";

import Picker from "emoji-picker-react";
import useEmojiModalOutClick from "hooks/useEmojiModalOutClick";
import BarLoader from "components/loader/BarLoader";
import styled from "./TweetForm.module.scss";

import useTranslation from "hooks/useTranslation";
import imageCompression from "browser-image-compression";
import useGetFbInfo from "hooks/useGetFbInfo";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";

export default function TweetForm({ userObj, tweetModal, setTweetModal }: any) {
  const [tweet, setTweet] = useState<string>("");
  const [attachment, setAttachment] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [progressBarCount, setProgressBarCount] = useState<number>(0);
  const [select, setSelect] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { myInfo } = useGetFbInfo();

  // 이모지 모달 밖 클릭 시 창 끔
  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick({ emojiRef });

  const t = useTranslation();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setProgressBarCount(0); // 프로그레스 바 초기화
    let attachmentUrl = "";
    const imgUid = uuidv4();

    // 입력 값 없을 시 업로드 X
    if (tweet !== "") {
      // 이미지 있을 때만 첨부
      if (attachment !== "") {
        //파일 경로 참조 만들기
        const key = `${userObj?.uid}/${imgUid}`;
        const storageRef = ref(storage, key);
        //storage 참조 경로로 파일 업로드 하기
        await uploadString(storageRef, attachment, "data_url");

        // storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
        attachmentUrl = await getDownloadURL(ref(storageRef));
      }

      const attachmentTweet = {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
        email: userObj.email,
        like: [],
        reTweet: [],
        replyId: [],
        imgUid: attachment ? imgUid : "",
        hashTags: tags,
      };

      const addTweet = async () => {
        // 업로드된 이미지의 download url 업데이트
        await addDoc(collection(db, "Tweets"), attachmentTweet)
          .then(() => {
            toast.success(t("ADD_TWEET_TOAST"));
            setTags([]);
            setHashTag("");
            setTweet("");
            setAttachment("");
            setProgressBarCount(0); // 프로그레스 바 초기화
            if (!tweetModal) {
              if (textRef.current) textRef.current.style.height = "52px";
            } else {
              setTweetModal(false);
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
          addTweet().then(() => {
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
      setTweet(value);
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

  const handleDeleteImage = () => {
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

  const onEmojiClick = (event: any) => {
    const textEmoji =
      tweet.slice(0, textRef.current?.selectionStart) +
      event.emoji +
      tweet.slice(textRef.current?.selectionEnd, tweet.length);
    setTweet(textEmoji);
  };

  return (
    <>
      {progressBarCount !== 0 && <BarLoader count={progressBarCount} />}
      <div
        className={`${styled.tweetForm} ${tweetModal && styled.modalBorder}`}
      >
        <div className={styled.tweetInput__container}>
          <div className={styled.tweet__profile}>
            {myInfo && (
              <img
                src={myInfo?.photoURL || PROFILE_DEFAULT_URL}
                alt="profileImg"
                className={styled.profile__image}
              />
            )}
          </div>
          <form className={styled.tweetInput} onSubmit={onSubmit}>
            <div className={`${select === "text" && styled.focus}`}>
              <textarea
                className={styled.tweetInput__input}
                spellCheck="false"
                value={tweet}
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

              {/* 해쉬태그 */}
              <div
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
              </div>
            </div>
            <div className={styled.tweetInput__add}>
              <div className={styled.tweetInput__iconBox}>
                <label
                  htmlFor={tweetModal ? "modal-attach-file" : "attach-file"}
                  className={styled.tweetInput__label}
                >
                  <div className={styled.tweetInput__icon}>
                    <IoImageOutline />
                  </div>
                </label>
                <input
                  ref={fileInput}
                  id={tweetModal ? "modal-attach-file" : "attach-file"}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              <div
                ref={emojiRef}
                onClick={toggleEmoji}
                className={styled.tweetInput__iconBox}
              >
                <div
                  className={`${styled.tweetInput__icon} ${styled.emoji__icon}`}
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
                className={styled.tweetInput__arrow}
                disabled={tweet === "" && attachment === ""}
              />
            </div>

            {/* 이미지 컨텐츠 */}
            {attachment && (
              <div className={styled.tweetForm__attachment}>
                <div className={styled.tweetForm__image}>
                  <img
                    src={attachment}
                    alt="upload file"
                    style={{
                      backgroundImage: attachment,
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
          </form>
        </div>
      </div>
    </>
  );
}
