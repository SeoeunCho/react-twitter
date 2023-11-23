import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "components/searchBar/SearchBar";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import ExploreTweets from "components/explore/ExploreTweets";
import ExploreUsers from "components/explore/ExploreUsers";
// import { UserObjProps } from "pages/Router";

export default function ExplorePage({ userObj }: any) {
  const [selected, setSelected] = useState<number>(1);
  
  const location = useLocation();
  const navigate = useNavigate();

  const goTweet = () => {
    if (selected === 1) {
      navigate("/explore/tweets");
    } else {
      navigate("/explore/users");
    }
  };

  useEffect(() => {
    if (location.pathname.includes("/tweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/users")) {
      setSelected(2);
    }
  }, [location.pathname]);

  return (
    <>
      <div className="menu_container">
        <div
          className="main__container"
          style={{ borderBottom: "1px solid var(--grayLight)" }}
        >
          <div className="main__category">
            <SearchBar />
          </div>
          <nav className="categoryList">
            <TabMenuBtn
              num={1}
              selected={selected}
              url={"/explore/tweets/"}
              text={"TAB_TWEET"}
            />
            <TabMenuBtn
              num={2}
              selected={selected}
              url={"/explore/users"}
              text={"TAB_USER2"}
            />
          </nav>
        </div>

        {selected === 1 ? (
          <div onClick={goTweet}>
            <ExploreTweets userObj={userObj} />
          </div>
        ) : (
          <div onClick={goTweet}>
            <ExploreUsers />
          </div>
        )}
      </div>
    </>
  );
}
