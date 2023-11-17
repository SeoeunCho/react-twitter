import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SearchBar from "components/searchBar/SearchBar";
import TabMenuBtn from "components/buttons/TabMenuBtn";
import ExploreTweets from "components/explore/ExploreTweets";
import ExploreUsers from "components/explore/ExploreUsers";
import { Link } from "react-router-dom";

export default function ExplorePage({ userObj }: any) {
  const location = useLocation();
  const [selected, setSelected] = useState<number>(1);

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
            <SearchBar userObj={userObj} />
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
          <Link to="/explore/tweets">
            <ExploreTweets userObj={userObj} />
          </Link>
        ) : (
          <Link to={"/explore/users"}>
            <ExploreUsers />
          </Link>
        )}
      </div>
    </>
  );
}
