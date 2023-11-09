import NotificationBox from "components/notifications/NotificationBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext, useEffect, useState } from "react";

export interface NotificationProps {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: number;
}

type tabType = "following" | "comment";

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [notiFollower, setNotiFollower] = useState<NotificationProps[]>([]);
  const [notiComment, setNotiComment] = useState<NotificationProps[]>([]);
  const [activeTab, setActiveTab] = useState<tabType>("following");
  const t = useTranslation();

  useEffect(() => {
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQury = query(
        ref,
        where("uid", "==", user?.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(notificationQury, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setNotifications(dataObj as NotificationProps[]);
      });
    }
  }, [user]);

  useEffect(() => {
    if (notifications?.length > 0) {
      const followerArr = notifications.filter((noti) => noti.url === "#");
      const commentArr = notifications.filter((noti) => noti.url !== "#");
      setNotiFollower(followerArr);
      setNotiComment(commentArr);
      console.log("notifications", user, notifications, notiFollower, notiComment);
    }
  }, [notifications]);

  return (
    <>
      <div className="main__category">
        <div className="main_text">
          <h2>{t("MENU_NOTI")}</h2>
        </div>
      </div>

      <div className="tab__container">
        <div className="main__container">
          <nav className="categoryList">
            <div
              className="container sizeContainer"
              onClick={() => {
                setActiveTab("following");
              }}
            >
              <div
                className={`btnBox ${
                  activeTab === "following" && "selectedBox"
                }`}
              >
                {t("TAB_FOLLOWING")}
              </div>
            </div>

            <div
              className="container sizeContainer"
              onClick={() => {
                setActiveTab("comment");
              }}
            >
              <div
                className={`btnBox ${activeTab === "comment" && "selectedBox"}`}
              >
                {t("TAB_COMMENT")}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {activeTab === "following" &&
        notiFollower?.length > 0 &&
        notiFollower?.map((noti) => (
          <NotificationBox notification={noti} tab={activeTab} key={noti.id} />
        ))}

      {activeTab === "comment" &&
        notiComment?.length > 0 &&
        notiComment?.map((noti) => (
          <NotificationBox notification={noti} tab={activeTab} key={noti.id} />
        ))}

      {activeTab === "following" && notiFollower?.length === 0 && (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_FOLLOWING")}</p>
          </div>
        </div>
      )}

      {activeTab === "comment" && notiComment?.length === 0 && (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_COMMENT")}</p>
          </div>
        </div>
      )}

      {/* <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_FOLLOWING")}</p>
          </div>
        </div> */}

      {/* {activeTab === "comment" && notiComment?.length > 0 ? (
        notiComment?.map((noti) => (
          <NotificationBox notification={noti} key={noti.id} />
        ))
      ) : (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_COMMENT")}</p>
          </div>
        </div>
      )} */}

      {/* {notifications?.map((noti) => {
        if (noti.url !== "#") {
          return <NotificationBox notification={noti} key={noti.id} />;
        } else {
          return <NotificationBox notification={noti} key={noti.id} />;
        }
      })} */}

      {/* NO_NOTIFICATIONS_FOLLOWING */}
      {/* {activeTab === "comment" && notifications?.length > 0 ? (
        notifications?.map((noti) => (
          <NotificationBox notification={noti} key={noti.id} />
        ))
      ) : (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_COMMENT")}</p>
          </div>
        </div>
      )} */}
    </>
  );
}
