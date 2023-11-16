import Header from "components/header";
import AuthContext from "context/AuthContext";
import { updateProfile } from "firebase/auth";
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { storage } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

export default function ProfileEdit() {
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const t = useTranslation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setDisplayName(value);
  };

  const onSubmit = async (e: any) => {
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;

    e.preventDefault();

    try {
      // 기존 유저 이미지가 Firebase Storage 이미지일 경우에만 삭제
      if (
        user?.photoURL &&
        user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)
      ) {
        const imageRef = ref(storage, user?.photoURL);
        if (imageRef) {
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });
        }
      }
      // 이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, "data_url");
        newImageUrl = await getDownloadURL(data?.ref);
      }
      // updateProfile 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImageUrl || "",
        })
          .then(() => {
            toast.success(t("ADD_PROFILE_TOAST"));
            navigate(`/profile/${user?.email}`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user?.photoURL);
    }

    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user?.displayName, user?.photoURL]);

  return (
    <div className="tweet" onSubmit={onSubmit}>
      <Header menu={"profileEdit"} text={"BUTTON_EDIT_PROFILE"} />
      <form className="tweet-form">
        <div className="tweet-form__profile">
          <input
            type="text"
            name="displayName"
            className="tweet-form__input"
            placeholder={t("NAME_PLACEHOLDER")}
            onChange={onChange}
            value={displayName}
          />
          {imageUrl && (
            <div className="tweet-form__attachment">
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="tweet-form__clear-btn"
              >
                {t("BUTTON_DELETE")}
              </button>
            </div>
          )}

          <div className="tweet-form__submit-area">
            <div className="tweet-form__image-area">
              <label className="tweet-form__file" htmlFor="file-input">
                <FiImage className="tweet-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="submit"
              value={t("BUTTON_EDIT_PROFILE")}
              className="tweet-form__submit-btn"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
