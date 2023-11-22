import { useRef, useState } from "react";
import styled from "./EditProfileModal.module.scss";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import {
  IoCameraOutline,
  IoCameraReverseOutline,
  IoCloseSharp,
} from "react-icons/io5";
import { db } from "firebaseApp";
import { setCurrentUser } from "reducer/user";
import useTranslation from "hooks/useTranslation";
import { toast } from "react-toastify";

const PROFILE_DEFAULT_URL = "/noneProfile.jpg";
const PROFILE_BG_URL = "/bgimg.jpg";

export default function EditProfileModal({
  creatorInfo,
  isEditing,
  toggleEdit,
}: any) {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [newDisplayName, setNewDisplayName] = useState<any>(
    creatorInfo.displayName
  );
  const [desc, setDesc] = useState<any>(creatorInfo.description);
  const [editAttachment, setEditAttachment] = useState<any>(
    creatorInfo.photoURL
  );
  const [editAttachmentBg, setEditAttachmentBg] = useState<any>(
    creatorInfo.bgURL
  );
  const [isDeleteProfileURL, setIsDeleteProfileURL] = useState<boolean>(false);
  const [isDeleteBgURL, setIsDeleteBgURL] = useState<boolean>(false);
  const [isAddFile, setIsAddFile] = useState<boolean | null>(null);
  const [select, setSelect] = useState<string>("");
  const t = useTranslation();

  const onChangeInfo = (e: any, type: any) => {
    if (type === "displayName") {
      setNewDisplayName(e.target.value);
    } else if (type === "description") {
      setDesc(e.target.value);
    }
  };

  // 이미지 압축
  const compressImage = async (image: any) => {
    try {
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 600,
      };
      return await imageCompression(image, options);
    } catch (e) {
      console.log(e);
    }
  };

  // 이미지 URL로 바꾸는 로직
  const onFileChange = async (e: any, type: any) => {
    setIsAddFile(true);
    const file = e.target.files[0]; // 파일 1개만 첨부
    const compressedImage = await compressImage(file); // 이미지 압축
    const fileReader = new FileReader(); // 파일 이름 읽기

    fileReader.onloadend = (e: any) => {
      if (type === "profile") {
        setEditAttachment(e.currentTarget.result);
      } else {
        setEditAttachmentBg(e.currentTarget.result);
      }
    };

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
          Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (file && compressedImage) {
      fileReader.readAsDataURL(compressedImage);
    }
  };

  const onDeleteClick = async (type: any) => {
    const profileType = type === "profile";
    const confirmMessage = profileType
      ? t("CHECK_DELETE_PROFILE_IMG_TOAST")
      : t("CHECK_DELETE_BG_IMG_TOAST");
    const setDeleteType = profileType
      ? setIsDeleteProfileURL
      : setIsDeleteBgURL;
    const setEditType = profileType ? setEditAttachment : setEditAttachmentBg;

    const ok = window.confirm(confirmMessage);
    // 이미지 없는 글 삭제 시 에러가 나와서 예외 처리
    // (삭제 시 tweetObj.attachmentUrl로 찾아가기 때문)
    if (ok) {
      setDeleteType(true);
      setEditType(profileType ? PROFILE_DEFAULT_URL : PROFILE_BG_URL);
      setIsAddFile(false);
    }
  };

  // 업데이트 버튼
  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (creatorInfo?.email) {
      await updateDoc(doc(db, "Users", `${creatorInfo.email}`), {
        displayName: newDisplayName, // 바뀐 이름 업데이트
        photoURL: editAttachment,
        bgURL: editAttachmentBg,
        description: desc,
      });
    }

    dispatch(
      setCurrentUser({
        displayName: newDisplayName, // 바뀐 이름 디스패치
        photoURL: editAttachment,
        bgURL: editAttachmentBg,
        description: desc,
        ...currentUser,
      })
    );

    // 프로필 이미지 삭제 버튼 클릭 시
    if (isDeleteProfileURL && creatorInfo?.email) {
      await updateDoc(doc(db, "Users", `${creatorInfo.email}`), {
        photoURL: PROFILE_DEFAULT_URL,
      });
      dispatch(
        setCurrentUser({
          photoURL: PROFILE_DEFAULT_URL,
          displayName: newDisplayName,
          description: desc,
          ...currentUser,
        })
      );
    }

    // 배경 이미지 삭제 버튼 클릭 시
    if (isDeleteBgURL && creatorInfo?.email) {
      await updateDoc(doc(db, "Users", `${creatorInfo.email}`), {
        bgURL: PROFILE_BG_URL,
      });
      dispatch(
        setCurrentUser({
          bgURL: PROFILE_BG_URL,
          displayName: newDisplayName,
          description: desc,
          ...currentUser,
        })
      );
    }

    toast.success(t("EDIT_PROFILE_TOAST"));
    toggleEdit(false);
  };

  return (
    <Modal
      open={isEditing}
      onClose={toggleEdit}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <form className={styled.editForm} onSubmit={onSubmit}>
          <div className={styled.topBox}>
            <div className={styled.close} onClick={toggleEdit}>
              <GrClose />
            </div>
            <div className={styled.submit}>
              <input
                type="submit"
                value={t("BUTTON_EDIT_PROFILE")}
                className={styled.editInput__arrow}
                disabled={
                  newDisplayName === creatorInfo.displayName &&
                  desc === creatorInfo.description &&
                  !isAddFile &&
                  !isDeleteProfileURL &&
                  !isDeleteBgURL
                }
              />
            </div>
          </div>
          <div className={styled.setUserInfo}>
            <div className={styled.backImage}>
              <div className={styled.image__iconBox}>
                <label htmlFor="attach-bgfile">
                  {editAttachmentBg !== PROFILE_BG_URL ? (
                    <div className={styled.image__icon}>
                      {/* 변경 */}
                      <IoCameraReverseOutline />
                    </div>
                  ) : (
                    <div className={styled.image__icon}>
                      {/* 추가 */}
                      <IoCameraOutline />
                    </div>
                  )}
                </label>
                {editAttachmentBg !== PROFILE_BG_URL && (
                  <div
                    className={styled.image__icon}
                    onClick={() => onDeleteClick("bg")}
                  >
                    <IoCloseSharp />
                  </div>
                )}
                <input
                  id="attach-bgfile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "bg")}
                  style={{
                    display: "none",
                  }}
                />
              </div>
              <div className={styled.bgImageBox}>
                <img src={editAttachmentBg} alt="배경화면 이미지" />
              </div>
            </div>
            <div className={styled.editBox}>
              <div className={styled.edit}>
                <div className={styled.profile__image}>
                  <div className={styled.image__iconBox}>
                    <label htmlFor="attach-file">
                      {editAttachment !== PROFILE_DEFAULT_URL ? (
                        <div className={styled.image__icon}>
                          {/* 변경 */}
                          <IoCameraReverseOutline />
                        </div>
                      ) : (
                        <div className={styled.image__icon}>
                          {/* 추가 */}
                          <IoCameraOutline />
                        </div>
                      )}
                    </label>
                    {editAttachment !== PROFILE_DEFAULT_URL && (
                      <div
                        className={styled.image__icon}
                        onClick={() => onDeleteClick("profile")}
                      >
                        <IoCloseSharp />
                      </div>
                    )}
                    <input
                      id="attach-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(e, "profile")}
                      style={{
                        display: "none",
                      }}
                    />
                  </div>
                  <img src={editAttachment} alt="프로필 이미지" />
                </div>
              </div>
              <div
                className={`${styled.edit} ${
                  select === "name" && styled.select
                } ${creatorInfo.displayName !== "" && styled.focus}`}
              >
                <div className={styled.edit__InputBox}>
                  <p>{t("PROFILE_NAME")}</p>
                  <input
                    maxLength={25}
                    className={styled.edit__Input}
                    ref={inputRef}
                    spellCheck="false"
                    type="text"
                    onFocus={() => setSelect("name")}
                    onBlur={() => setSelect("")}
                    value={newDisplayName}
                    onChange={(e) => {
                      onChangeInfo(e, "displayName");
                    }}
                    required
                  />
                </div>
              </div>
              <div
                className={`${styled.edit} ${
                  select === "desc" && styled.select
                } ${creatorInfo.description !== "" && styled.focus}`}
              >
                <div className={styled.edit__InputBox}>
                  <p>{t("PROFILE_ABOUT_ME")}</p>
                  <textarea
                    rows={3}
                    className={`${styled.edit__Input} ${styled.edit__textarea}`}
                    spellCheck="false"
                    onFocus={() => setSelect("desc")}
                    onBlur={() => setSelect("")}
                    value={desc}
                    onChange={(e) => {
                      onChangeInfo(e, "description");
                    }}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
