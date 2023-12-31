import TopButton from "../components/buttons/TopButton";
import LeftMenu from "pages/menu/LeftMenu";
import HomePage from "pages/home";
import ExplorePage from "pages/explore";
import NotificationPage from "pages/notification";
import BookmarkPage from "pages/bookmark";
import DetailTweet from "components/detail/DetailTweet";
import ProfilePage from "pages/profile";
import NotFound from "./NotFound";
import RightMenu from "pages/menu/RightMenu";
import AuthPage from "pages/auth";

import { Route, Routes, Navigate } from "react-router-dom";
import { UserProps } from "App";

export interface UserObjProps {
  isAuthenticated?: boolean;
  userObj: any | null;
}

export default function Router({ isAuthenticated, userObj }: UserObjProps) {
  return (
    <>
      <TopButton />

      {isAuthenticated ? (
        <div className="container">
          <LeftMenu userObj={userObj} />
          <div className="center__container">
            <Routes>
              <Route path="/*" element={<HomePage userObj={userObj} />} />
              <Route
                path="/explore/*"
                element={<ExplorePage userObj={userObj} />}
              />
              <Route
                path="/notification/*"
                element={<NotificationPage userObj={userObj} />}
              />
              <Route
                path="/bookmark/*"
                element={<BookmarkPage userObj={userObj} />}
              />
              <Route
                path="/tweet/:id"
                element={<DetailTweet userObj={userObj} />}
              />
              <Route
                path="/profile/:type/:id"
                element={<ProfilePage userObj={userObj} />}
              />
              <Route
                path="/user/:type/:id"
                element={<ProfilePage userObj={userObj} />}
              />
              <Route path="*" element={<Navigate replace to="/" />} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </div>
          <RightMenu />
        </div>
      ) : (
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate replace to="/auth" />} />
        </Routes>
      )}
    </>
  );
}
