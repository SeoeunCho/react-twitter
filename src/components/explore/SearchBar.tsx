import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { db } from "firebaseApp";
import styled from "./SearchBar.module.scss";
import SearchBox from "./SearchBox";
import useHandleOutsideClick from "hooks/useHandleOutsideClick";
import AuthContext from "context/AuthContext";

export default function SearchBar() {
  const searchRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState<string>("");
  const [userResult, setUserResult] = useState<any[]>([]);
  const [xweetResult, setTweetResult] = useState([]);
  const [users, setUsers] = useState([]);
  const [xweets, setTweets] = useState([]);
  const [focus, setFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  useHandleOutsideClick({
    ref: searchRef,
    isModal: focus,
    setIsModal: setFocus,
  });

  const onClick = useCallback(
    (e: any) => {
      setFocus(true);
      textRef.current?.focus();
    },
    [setFocus]
  );

  useEffect(() => {
    // 유저 정보
    const userInfo = async () => {
      const q = query(collection(db, "Users"));
      const data = await getDocs(q);

      const userArray = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      const exceptArray: any = userArray.filter(
        (name: any) => name.uid !== user?.uid
      );
      setUsers(exceptArray);
    };

    // 트윗 정보
    const xweetInfo = async () => {
      const q = query(collection(db, "Tweets"));
      // onSnapshot(
      //   q,
      //   (snapshot) => {
      //     const xweetArray = snapshot?.docs?.map((doc: any) => ({
      //       id: doc.id,
      //       ...doc.data(),
      //     }));

      //     // 본인 제외 노출
      //     const exceptArray = xweetArray.filter(
      //       (xweet: any) => xweet.creatorId !== user?.uid
      //     );
      //     setTweets(exceptArray);
      //   },
      //   []
      // );
    };
    userInfo();
    xweetInfo();
  }, [user]);

  useEffect(() => {
    // 닉네임/이메일 검색
    if (focus && search !== "") {
      const filterNameAndEmail = users?.filter(
        (user: any) =>
          user?.displayName?.includes(search) ||
          user?.email?.split("@")[0].includes(search)
      );
      setUserResult(filterNameAndEmail);
      setLoading(true);
    } else {
      setUserResult([]);
    }
    // 트윗 검색
    if (focus && search !== "") {
      const filterTweets = xweets?.filter((xweet: any) =>
        xweet.text.includes(search)
      );
      setTweetResult(filterTweets);
      setLoading(true);
    } else {
      setTweetResult([]);
    }
  }, [focus, xweets, search, users]);

  const onChange = debounce((e) => {
    textRef.current?.focus();
    setSearch(e.target.value);
  }, 200);

  return (
    <article className={styled.container}>
      <section className={styled.searchbox}>
        <div
          className={`${styled.search} ${focus && styled.search__focus}`}
          onClick={onClick}
          ref={searchRef}
        >
          <FiSearch
            className={`${styled.search__icon} ${
              focus && styled.search__focusIcon
            }`}
          />
          <input
            spellCheck={false}
            ref={textRef}
            className={styled.search__bar}
            placeholder="트위터 검색"
            onChange={onChange}
          />
        </div>
        {focus && (
          <SearchBox
            user={user}
            search={search}
            users={users}
            focus={focus}
            xweets={xweets}
            userResult={userResult}
            xweetResult={xweetResult}
            loading={loading}
          />
        )}
      </section>
    </article>
  );
}
