import HomePage from "pages/home";
import NotificationsPage from "pages/notifications";
import PostListPage from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostEdit from "pages/posts/edit";
import PostNew from "pages/posts/new";
import ProfilePage from "pages/profile";
import ProfileEdit from "pages/profile/edit";
import ExplorePage from "pages/explore";
import AuthPage from "pages/auth";
import TopButton from "../components/buttons/TopButton";
import { Route, Routes, Navigate } from "react-router-dom";
// import AuthContext from "context/AuthContext";
// import useTranslation from "hooks/useTranslation";

import LeftMenu from "pages/menu/LeftMenu";
import RightMenu from "pages/menu/RightMenu";
// import { useContext } from "react";

interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
  // const { user } = useContext(AuthContext);
  // const t = useTranslation();

  return (
    <>
      <TopButton />

      {isAuthenticated ? (
        <>
          <div className="container">
            <LeftMenu />
            <div className="center__container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/posts" element={<PostListPage />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/posts/new" element={<PostNew />} />
                <Route path="/posts/edit/:id" element={<PostEdit />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="*" element={<Navigate replace to="/" />} />
              </Routes>
            </div>
            <RightMenu />
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate replace to="/auth" />} />
          </Routes>
        </>
      )}
    </>
  );
}
