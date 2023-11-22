import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import ProfileReTweets from "./ProfileReTweets";
import ProfileReTweetsReplies from "./ProfileReTweetsReplies";

export default function ProfileReTweetBox({ userObj, creatorInfo }: any) {
  const [selected, setSelected] = useState<number>(1);
  
  const location = useLocation();
  const navigate = useNavigate();

  const goPage = (e: any) => {
    e.stopPropagation();
    if (location.pathname.includes("/user/")) {
      if (selected === 1) {
        navigate(`/user/retweets/${creatorInfo.email}`);
        navigate(`/profile/retweets/${creatorInfo.email}`);
      } else {
        navigate(`/user/retweetsreplies/${creatorInfo.email}`);
        navigate(`/user/retweetsreplies/${creatorInfo.email}`);
      }
    }
  };

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
              text={"TAB_TWEET"}
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

        {selected === 1 ? (
          <div onClick={goPage}>
            <ProfileReTweets userObj={userObj} creatorInfo={creatorInfo} />
          </div>
        ) : (
          <div onClick={goPage}>
            <ProfileReTweetsReplies
              userObj={userObj}
              creatorInfo={creatorInfo}
            />
          </div>
        )}
        {/* <Routes>
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
        </Routes> */}
      </div>
    </>
  );
}
