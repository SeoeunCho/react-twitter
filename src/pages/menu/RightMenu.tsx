import RecommendUser from "components/recommendUser/RecommendUser";
import SearchBar from "components/searchBar/SearchBar";
import styled from "./RightMenu.module.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { UserObjProps } from "pages/Router";

export default function RightMenu({ userObj }: any) {
  const [hiddenSearch, setHiddenSearch] = useState<boolean>(false);
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.includes("explore")) {
      setHiddenSearch(true);
    }
    return () => setHiddenSearch(false);
  }, [location.pathname]);

  return (
    <article className={styled.container}>
      {!hiddenSearch && <SearchBar userObj={userObj} />}
      <RecommendUser />
    </article>
  );
}
