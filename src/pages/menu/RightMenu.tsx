// import RecommendUser from "../components/recommendUser/RecommendUser";
import SearchBar from "components/explore/SearchBar";
import styled from "./RightMenu.module.scss";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RightMenu() {
  const location = useLocation();
  const [hiddenSearch, setHiddenSearch] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("explore")) {
      setHiddenSearch(true);
    }
    return () => setHiddenSearch(false);
  }, [location.pathname]);

  return (
    <article className={styled.container}>
      {!hiddenSearch && <SearchBar />}
      {/* <RecommendUser /> */}
    </article>
  );
}
