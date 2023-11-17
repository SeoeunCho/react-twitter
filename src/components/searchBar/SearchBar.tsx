import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { db } from "firebaseApp";
import useHandleOutsideClick from "hooks/useHandleOutsideClick";
import styled from "./SearchBar.module.scss";
import SearchBox from "./SearchBox";
import useTranslation from "hooks/useTranslation";

export default function SearchBar({ userObj }: any) {
  const searchRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState<string>("");
  const [userResult, setUserResult] = useState<any[]>([]);
  const [tweetResult, setTweetResult] = useState([]);
  const [users, setUsers] = useState<any>([]);
  const [tweets, setTweets] = useState<any>([]);
  const [focus, setFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslation();

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
      const usersQuery = query(collection(db, "Users"));
      const data = await getDocs(usersQuery);

      const userArray = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      const exceptArray = userArray.filter(
        (name: any) => name.uid !== userObj?.uid
      );
      setUsers(exceptArray);
    };

    // 트윗 정보
    const tweetInfo = async () => {
      const tweetsQuery = query(collection(db, "Tweets"));
      onSnapshot(tweetsQuery, (snapShot) => {
        const tweetArray = snapShot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 본인 제외 노출
        const exceptArray = tweetArray.filter(
          (tweet) => tweet.creatorId !== userObj?.uid
        );
        setTweets(exceptArray);
      });
    };
    userInfo();
    tweetInfo();
  }, [userObj]);

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
      const filterTweets = tweets?.filter((tweet: any) =>
        tweet.text.includes(search)
      );
      setTweetResult(filterTweets);
      setLoading(true);
    } else {
      setTweetResult([]);
    }
  }, [focus, tweets, search, users]);

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
            placeholder={t("EXPLORE_PLACEHOLDER")}
            onChange={onChange}
          />
        </div>
        {focus && (
          <SearchBox
            userObj={userObj}
            search={search}
            users={users}
            focus={focus}
            tweets={tweets}
            userResult={userResult}
            tweetResult={tweetResult}
            loading={loading}
          />
        )}
      </section>
    </article>
  );
}
