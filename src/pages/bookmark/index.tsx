import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "firebaseApp";
// import { UserObjProps } from "../Router";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import CircleLoader from "components/loader/CircleLoader";
import Header from "components/header";
import BookmarkTweets from "components/bookmark/BookmarkTweets";
import BookmarkReplies from "components/bookmark/BookmarkReplies";
// import { ReTweetProps } from "pages/home";

export default function BookmarkPage({ userObj }: any) {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [creatorInfo, setCreatorInfo] = useState<any>([]);
  const [reTweets, setReTweets] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(1);
  const navigate = useNavigate();

  const goPage = (e: any) => {
    e.stopPropagation();

    if (location.pathname.includes(userObj.email)) {
      if (selected === 1) {
        navigate(`/profile/bookmarktweets/${userObj.email}`);
      } else if (selected === 2) {
        navigate(`/profile/bookmarkreplies/${userObj.email}`);
      }
    } else {
      if (selected === 1) {
        navigate("/bookmark/tweets");
      } else if (selected === 2) {
        navigate("/bookmark/replies");
      }
    }
  };

  useEffect(() => {
    if (location.pathname.includes("tweets")) {
      setSelected(1);
    } else if (location.pathname.includes("replies")) {
      setSelected(2);
    }
  }, [location.pathname]);

  // 본인 정보 가져오기
  useEffect(() => {
    if (userObj?.email) {
      onSnapshot(doc(db, "Users", `${userObj.email}`), (doc) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      });
    }
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
                  ? `/profile/bookmarktweets/${userObj.email}`
                  : "/bookmark/tweets"
              }
              text={"TAB_TWEET"}
            />
            <TabMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes(userObj.email)
                  ? `/profile/bookmarkreplies/${userObj.email}`
                  : "/bookmark/replies"
              }
              text={"TAB_REPLY"}
            />
          </nav>
        </div>

        {loading && selected === 1 && (
          <div onClick={goPage}>
            <BookmarkTweets
              userObj={userObj}
              reTweetsObj={reTweets}
              creatorInfo={creatorInfo}
              loading={loading}
            />
          </div>
        )}

        {loading && selected === 2 && (
          <div onClick={goPage}>
            <BookmarkReplies
              userObj={userObj}
              reTweetsObj={reTweets}
              creatorInfo={creatorInfo}
              loading={loading}
            />
          </div>
        )}

        {!loading && <CircleLoader />}
      </div>
    </>
  );
}
