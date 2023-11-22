import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileLikeTweets from "./ProfileLikeTweets";
import ProfileLikeReplies from "./ProfileLikeReplies";
import TabMenuBtn from "components/buttons/TabMenuBtn";

export default function ProfileLikeBox({ userObj }: any) {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [selected, setSelected] = useState(1);
  const navigate = useNavigate();

  const goPage = (e: any) => {
    e.stopPropagation();
    if (location.pathname.includes("/user/")) {
      if (selected === 1) {
        navigate(`/user/liketweets/${uid}`);
      } else {
        navigate(`/user/likereplies/${uid}`);
      }
    } else {
      if (selected === 1) {
        navigate(`/profile/liketweets/${uid}`);
      } else {
        navigate(`/profile/likereplies/${uid}`);
      }
    }
  };

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
              text={"TAB_TWEET"}
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
          <div onClick={goPage}>
            <ProfileLikeTweets userObj={userObj} />
          </div>
        ) : (
          <div onClick={goPage}>
            <ProfileLikeReplies userObj={userObj} />
          </div>
        )}
      </div>
    </>
  );
}
