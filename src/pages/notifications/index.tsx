import Header from "components/header";
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
  content: string;
  createdAt: number;
  uid: string;
  profileUrl: string;
  isRead: boolean;
  email: string;
  url: string;
  displayName: string;
}

type tabType = "following" | "reply";

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [notiFollower, setNotiFollower] = useState<NotificationProps[]>([]);
  const [notiReply, setNotiReply] = useState<NotificationProps[]>([]);
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
      const followerArr = notifications.filter((noti) => !noti.content);
      const replyArr = notifications.filter((noti) => noti.content);
      setNotiFollower(followerArr);
      setNotiReply(replyArr);
    }
  }, [notifications]);

  return (
    <>
      <Header menu={"notification"} text={"MENU_NOTI"} />

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
                {t("BUTTON_FOLLOW")}
              </div>
            </div>

            <div
              className="container sizeContainer"
              onClick={() => {
                setActiveTab("reply");
              }}
            >
              <div
                className={`btnBox ${activeTab === "reply" && "selectedBox"}`}
              >
                {t("TAB_REPLY")}
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

      {activeTab === "reply" &&
        notiReply?.length > 0 &&
        notiReply?.map((noti) => (
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

      {activeTab === "reply" && notiReply?.length === 0 && (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_REPLY")}</p>
          </div>
        </div>
      )}

      {/* <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_FOLLOWING")}</p>
          </div>
        </div> */}

      {/* {activeTab === "reply" && notiReply?.length > 0 ? (
        notiReply?.map((noti) => (
          <NotificationBox notification={noti} key={noti.id} />
        ))
      ) : (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_REPLY")}</p>
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
      {/* {activeTab === "reply" && notifications?.length > 0 ? (
        notifications?.map((noti) => (
          <NotificationBox notification={noti} key={noti.id} />
        ))
      ) : (
        <div className="noInfoBox">
          <div className="noInfo">
            <h2>{t("NO_POSTS")}</h2>
            <p>{t("NO_NOTIFICATIONS_REPLY")}</p>
          </div>
        </div>
      )} */}
    </>
  );
}
