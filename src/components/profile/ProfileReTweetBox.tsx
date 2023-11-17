import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import ProfileReTweets from "./ProfileReTweets";
import ProfileReTweetsReplies from "./ProfileReTweetsReplies";

export default function ProfileReTweetBox({ userObj, creatorInfo }: any) {
  const location = useLocation();
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("/retweets/")) {
      setSelected(1);
    } else if (location.pathname.includes("/retweetsreplies/")) {
      setSelected(2);
    }
  }, [location.pathname]);

  return (
    <>
      <div>
        <div className="main__container">
          <nav className="categoryList">
            <TabMenuBtn
              num={1}
              selected={selected}
              url={
                location.pathname.includes("/user/")
                  ? "/user/retweets/" + creatorInfo.email
                  : "/profile/retweets/" + creatorInfo.email
              }
              text={"TAB_USER"}
            />
            <TabMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes("/user/")
                  ? "/user/retweetsreplies/" + creatorInfo.email
                  : "/profile/retweetsreplies/" + creatorInfo.email
              }
              text={"TAB_REPLY"}
            />
          </nav>
        </div>

        <Routes>
          <Route
            path={
              location.pathname.includes("/user/")
                ? "/user/retweets/" + creatorInfo.email
                : "/profile/retweets/" + creatorInfo.email
            }
          >
            <ProfileReTweets userObj={userObj} creatorInfo={creatorInfo} />
          </Route>
          <Route
            path={
              location.pathname.includes("/user/")
                ? "/user/retweetsreplies/" + creatorInfo.email
                : "/profile/retweetsreplies/" + creatorInfo.email
            }
          >
            <ProfileReTweetsReplies
              userObj={userObj}
              creatorInfo={creatorInfo}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}
