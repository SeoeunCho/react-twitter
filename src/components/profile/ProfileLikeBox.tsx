import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ProfileLikeTweets from "./ProfileLikeTweets";
import ProfileLikeReplies from "./ProfileLikeReplies";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import { Link } from "react-router-dom";

export default function ProfileLikeBox({ userObj }: any) {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("liketweets")) {
      setSelected(1);
    } else if (location.pathname.includes("likereplies")) {
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
                  ? "/user/liketweets/" + uid
                  : "/profile/liketweets/" + uid
              }
              text={"TAB_USER"}
            />
            <TabMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes("/user/")
                  ? "/user/likereplies/" + uid
                  : "/profile/likereplies/" + uid
              }
              text={"TAB_REPLY"}
            />
          </nav>
        </div>

        {selected === 1 ? (
          <Link
            to={
              location.pathname.includes("/user/")
                ? "/user/liketweets/" + uid
                : "/profile/liketweets/" + uid
            }
          >
            <ProfileLikeTweets userObj={userObj} />
          </Link>
        ) : (
          <Link
            to={
              location.pathname.includes("/user/")
                ? "/user/likereplies/" + uid
                : "/profile/likereplies/" + uid
            }
          >
            <ProfileLikeReplies userObj={userObj} />
          </Link>
        )}
      </div>
    </>
  );
}
