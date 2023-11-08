import HomePage from "pages/home";
import NotificationsPage from "pages/notifications";
import PostListPage from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostEdit from "pages/posts/edit";
import PostNew from "pages/posts/new";
import ProfilePage from "pages/profile";
import ProfileEdit from "pages/profile/edit";
import SearchPage from "pages/search";
import AuthPage from "pages/auth";
import TopButton from "../components/buttons/TopButton";
// import LoginPage from "pages/users/login";
// import SignupPage from "pages/users/signup";
import { Route, Routes, Navigate } from "react-router-dom";

import LeftMenu from "pages/menu";

interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
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
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<Navigate replace to="/" />} />
              </Routes>
            </div>
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
