import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import styled from "./Home.module.css";
import { HiOutlineSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { setNotModal } from "reducer/user";
import { db } from "firebaseApp";
import Header from "components/header";
import TweetForm from "components/tweets/TweetForm";
import TweetListPage from "components/tweets/TweetListPage";
import TweetBox from "components/tweets/TweetBox";
import CircleLoader from "components/loader/CircleLoader";
import useTranslation from "hooks/useTranslation";
import useGetFbInfo from "hooks/useGetFbInfo";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import { useLocation } from "react-router-dom";

export interface TweetProps {
  id: string;
  email: string;
  content: string;
  createdAt: number;
  uid: string;
  profileUrl?: string;
  like?: string[];
  likeCount?: number;
  hashTags?: string[];
  attachmentUrl?: string;
  displayName: string;
  creatorId?: string;
  parent?: any;
}

interface UserIdProps {
  id: string;
}

type tabType = "all" | "following";

export default function HomePage({ userObj }: any) {
  // const [tweets, setTweets] = useState<TweetProps[]>([]);
  // const [reTweets, setReTweets] = useState<[]>([]);
  // const [replies, setReplies] = useState<ReplyProps[] | null>(null);
  // const [followingTweets, setFollowingTweets] = useState<TweetProps[]>([]);
  // const [followingIds, setFollowingIds] = useState<string[]>([""]);
  // const [activeTab, setActiveTab] = useState<tabType>("all");
  // const [loading, setLoading] = useState<boolean>(false);

  // const dispatch = useDispatch();
  // const { user } = useContext(AuthContext);
  const t = useTranslation();

  const dispatch = useDispatch();
  const currentNotModal = useSelector((state: any) => state.user.modal);
  const currentProgressBar = useSelector((state: any) => state.user.load);
  const [tweets, setTweets] = useState<any>([]);
  const [reTweets, setReTweets] = useState<any>([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(1);
  const { myInfo } = useGetFbInfo();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
  // const getFollowingIds = useCallback(async () => {
  //   if (userObj?.uid) {
  //     const ref = doc(db, "Following", userObj?.uid);
  //     onSnapshot(ref, (doc) => {
  //       setFollowingIds([""]);
  //       doc
  //         ?.data()
  //         ?.users?.map((user: UserIdProps) =>
  //           setFollowingIds((prev: string[]) =>
  //             prev ? [...prev, user?.id] : []
  //           )
  //         );
  //     });
  //   }
  // }, [userObj?.uid]);

  useEffect(() => {
    dispatch(setNotModal({ modal: true }));
  }, [dispatch]);

  useEffect(() => {
    const tweetsRef = collection(db, "Tweets");
    const tweetsQuery = query(tweetsRef, orderBy("createdAt", "desc")); // asc(오름차순), desc(내림차순)

    // Tweets 컬렉션 출력
    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      // map 사용 시 - 더 적게 리렌더링 하기 때문에 map 사용이 나음
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTweets(tweetArray);

      if (tweetArray) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    // Following 컬렉션 출력
    // const followingQuery = query(
    //   tweetsRef,
    //   where("uid", "in", followingIds),
    //   orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    // );
    // onSnapshot(followingQuery, (snapShot) => {
    //   const dataObj: any = snapShot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc?.id,
    //   }));
    //   setFollowingTweets(dataObj);
    // });

    return () => unsubscribe();
  }, []);

  // 리트윗 정보
  useEffect(() => {
    const reTweetsQuery = query(collection(db, "ReTweets"));

    const unsubscribe = onSnapshot(reTweetsQuery, (snapShot) => {
      const reTweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReTweets(reTweetArray);
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   if (userObj?.uid) getFollowingIds();
  // }, [getFollowingIds, user?.uid]);

  return (
    <>
      <div>
        <div>
          <Header menu={"home"} text={"MENU_HOME"} />
          {loading && <TweetForm userObj={userObj} />}
          <ul>
            {tweets?.length > 0 ? (
              tweets?.map((tweet: TweetProps) => (
                <TweetListPage
                  key={tweet.id}
                  tweetObj={tweet}
                  reTweetsObj={reTweets}
                  userObj={userObj}
                  isOwner={tweet.creatorId === userObj?.uid}
                />
              ))
            ) : (
              <div className="noInfoBox">
                <div className="noInfo">
                  <h2>{t("NO_TWEET")}</h2>
                  <p>{t("NO_TWEET_LIST")}</p>
                </div>
              </div>
            )}
            {!loading && <CircleLoader />}
          </ul>
          {/* <nav className="categoryList">
            <div
              className="tab_container sizeContainer"
              onClick={() => {
                setActiveTab("all");
              }}
            >
              <div className={`btnBox ${activeTab === "all" && "selectedBox"}`}>
                {t("TAB_ALL")}
              </div>
            </div>
            <div
              className="tab_container sizeContainer"
              onClick={() => {
                setActiveTab("following");
              }}
            >
              <div
                className={`btnBox ${
                  activeTab === "following" && "selectedBox"
                }`}
              >
                {t("TAB_FOLLOWING_ING")}
              </div>
            </div>
          </nav> */}
        </div>

        {/* {loading && activeTab === "all" && (
          <>
            <TweetForm />
            {tweets?.length > 0 ? (
              tweets?.map((tweet: TweetProps) => (
                <TweetListPage
                  key={tweet.id}
                  tweetObj={tweet}
                  reTweetsObj={reTweets}
                  userObj={userObj}
                  isOwner={tweet.creatorId === userObj?.uid}
                />
              ))
            ) : (
              <div className="noInfoBox">
                <div className="noInfo">
                  <h2>{t("NO_TWEET")}</h2>
                  <p>{t("NO_TWEET_LIST")}</p>
                </div>
              </div>
            )}
          </>
        )} */}

        {/* {loading && activeTab === "following" && (
          <div className="tweet">
            {followingTweets?.length > 0 ? (
              followingTweets?.map((tweet) => (
                <TweetBox
                  tweet={tweet}
                  detailId={tweet.id}
                  key={tweet.id}
                  tweetType={"tweet"}
                  detailTweet={false}
                />
              ))
            ) : (
              <div className="noInfoBox">
                <div className="noInfo">
                  <h2>{t("NO_TWEET")}</h2>
                  <p>{t("NO_TWEET_FLLOWING")}</p>
                </div>
              </div>
            )}
          </div>
        )} */}
      </div>
    </>
  );
}
