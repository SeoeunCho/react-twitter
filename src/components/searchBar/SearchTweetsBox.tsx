import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "./SearchTweetsBox.module.scss";

export default function SearchTweetsBox({ users, tweet }: any) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<any>([]);

  useEffect(() => {
    const filtered = users.filter((user: any) => user.uid === tweet.creatorId);
    setFilter(filtered);
  }, [tweet, users]);

  const goPage = () => {
    navigate("/tweet/" + tweet.id);
  };

  return (
    <>
      {filter[0] && (
        <div className={styled.follow__user} onClick={goPage}>
          <div className={styled.follow__userInfo}>
            <img
              src={filter[0].photoURL}
              alt="profileImg"
              className={styled.follow__image}
            />
            <div className={styled.follow__name}>
              <p>{filter[0].displayName}</p>
              <p>@{filter[0].email.split("@")[0]}</p>
              {filter[0].description && <p>{filter[0].description}</p>}
            </div>
          </div>
          <div className={styled.searchText}>
            <p>{tweet.text}</p>
          </div>
        </div>
      )}
    </>
  );
}
