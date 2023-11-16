import { useRef } from "react";
import styled from "./ExploreUsers.module.scss";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";
import { db } from "firebaseApp";
import useGetFbInfo from "hooks/useGetFbInfo";
import { useToggleFollow } from "hooks/useToggleFollow";
import CircleLoader from "components/loader/CircleLoader";

const ExploreUsers = () => {
  const btnRef = useRef<any>();
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { myInfo } = useGetFbInfo();
  const toggleFollow = useToggleFollow(myInfo);

  useEffect(() => {
    const userInfo = async () => {
      const usersQuery = query(collection(db, "Users"));
      const data = await getDocs(usersQuery);
      return data.docs.map((doc) => doc.data());
    };

    userInfo().then((userArray) => {
      // 본인 제외 노출
      const exceptArray = userArray.filter(
        (name) => name.uid !== myInfo?.uid
      );
      let cloneArr = cloneDeep(exceptArray);

      randomArray(cloneArr);

      const followFilter = cloneArr.filter((arr) =>
        myInfo?.following.some((follow: any) => follow.email === arr.email)
      );

      const combineArray = [...followFilter, ...cloneArr];
      setUsers([...Array.from(new Set(combineArray))].reverse()); // 중복 제거 후 팔로우 유저 뒤에 배치
      setLoading(true);
    });
  }, [myInfo?.following, myInfo?.uid]);

  // 랜덤 함수
  const randomArray = (array: any) => {
    // (피셔-예이츠)
    for (let index = array.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      const randomPosition = Math.floor(Math.random() * (index + 1));

      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
      const temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
  };

  return (
    <>
      {loading ? (
        <div className={styled.followBox}>
          {users.length !== 0 && (
            <ul className={styled.follows}>
              {users?.map((userInfo: any) => (
                <li key={userInfo?.uid} className={styled.follow__user}>
                  <Link
                    className={styled.follow__userInfo}
                    to={`/profile/mytweets/${userInfo?.email}`}
                  >
                    <img
                      src={userInfo?.photoURL}
                      alt="profileImg"
                      className={styled.follow__image}
                    />
                    <div className={styled.follow__name}>
                      <p>{userInfo?.displayName}</p>
                      <p>@{userInfo?.email?.split("@")[0]}</p>
                      {userInfo?.description && (
                        <p>: {userInfo?.description}</p>
                      )}
                    </div>
                  </Link>
                  <div ref={btnRef}>
                    {myInfo.following?.some(
                      (follow: any) => follow.email === userInfo?.email
                    ) ? (
                      <div
                        className={`${styled.follow__btn} ${styled.follow} `}
                        onClick={() => toggleFollow(userInfo)}
                      >
                        <p>팔로잉</p>
                      </div>
                    ) : (
                      <div
                        className={`${styled.follow__btn} ${styled.profile__followBtn} `}
                        onClick={() => toggleFollow(userInfo)}
                      >
                        <p>팔로우</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <CircleLoader />
      )}
    </>
  );
};

export default ExploreUsers;
