import { useNavigate } from "react-router-dom";
import styled from "./SearchTweetsBox.module.scss";
import useTranslation from "hooks/useTranslation";

export default function SearchUsersBox({ userResult }: any) {
  const navigate = useNavigate();
  const t = useTranslation();

  const goPage = (userId: any) => {
    navigate("/profile/mytweets/" + userId.email);
  };

  const showMore = () => {
    navigate("/explore/users/");
  };

  return (
    <>
      {userResult.slice(0, 4).map((user: any) => (
        <div
          key={user.email}
          className={styled.follow__user}
          onClick={() => goPage(user)}
        >
          <div className={styled.follow__userInfo}>
            <img
              src={user.photoURL}
              alt="프로필 이미지"
              className={styled.follow__image}
            />
            <div className={styled.follow__name}>
              <p>{user.displayName}</p>
              <p>@{user.email.split("@")[0]}</p>
              {user.description && <p>{user.description}</p>}
            </div>
          </div>
        </div>
      ))}
      {userResult.length >= 4 && (
        <div className={styled.more} onClick={showMore}>
          {t("BUTTON_MORE")}
        </div>
      )}
    </>
  );
}
