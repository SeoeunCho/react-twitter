import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Route, Routes, useLocation } from "react-router-dom";

import { db } from "firebaseApp";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import useTranslation from "hooks/useTranslation";
import CircleLoader from "components/loader/CircleLoader";
import Header from "components/header";
import BookmarkTweets from "components/bookmark/BookmarkTweets";
import BookmarkReplies from "components/bookmark/BookmarkReplies";
import { Link } from "react-router-dom";

export default function BookmarkPage({ userObj }: any) {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [creatorInfo, setCreatorInfo] = useState<any>([]);
  const [reTweets, setReTweets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(1);

  useEffect(() => {
    if (location.pathname.includes("tweets")) {
      setSelected(1);
    } else if (location.pathname.includes("replies")) {
      setSelected(2);
    }
  }, [location.pathname]);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(db, "Users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [userObj.email]);

  // 리트윗 정보
  useEffect(() => {
    const reTweetsQuery = query(collection(db, "ReTweets"));

    onSnapshot(reTweetsQuery, (snapShot) => {
      const reTweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReTweets(reTweetArray);
    });
  }, []);

  return (
    <>
      <div>
        {uid !== userObj.email && (
          <Header text={"MENU_BOOKMARK"} creatorInfo={creatorInfo} />
        )}
        <div className="main__container">
          <nav className="categoryList">
            <TabMenuBtn
              num={1}
              selected={selected}
              url={
                location.pathname.includes(userObj.email)
                  ? "/profile/bookmarktweets/" + userObj.email
                  : "/bookmark/tweets"
              }
              text={"TAB_TWEET"}
            />
            <TabMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes(userObj.email)
                  ? "/profile/bookmarkreplies/" + userObj.email
                  : "/bookmark/replies"
              }
              text={"TAB_REPLY"}
            />
          </nav>
        </div>

        {loading && selected === 1 && (
          <Link
            to={
              location.pathname.includes(userObj.email)
                ? "/profile/bookmarktweets/" + userObj.email
                : "/bookmark/tweets"
            }
          >
            {
              <BookmarkTweets
                userObj={userObj}
                reTweetsObj={reTweets}
                creatorInfo={creatorInfo}
                loading={loading}
              />
            }
          </Link>
        )}
        {loading && selected === 2 && (
          <Link
            to={
              location.pathname.includes(userObj.email)
                ? "/profile/bookmarkreplies/" + userObj.email
                : "/bookmark/replies"
            }
          >
            {
              <BookmarkReplies
                userObj={userObj}
                reTweetsObj={reTweets}
                creatorInfo={creatorInfo}
                loading={loading}
              />
            }
          </Link>
        )}
        {!loading && <CircleLoader />}
      </div>
    </>
  );
}
