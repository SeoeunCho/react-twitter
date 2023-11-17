import { languageState } from "atom";
import { useRecoilState } from "recoil";
import useTranslation from "./useTranslation";

export const useTimeToString = () => {
  const language = useRecoilState(languageState);
  const t = useTranslation();

  const timeToString = (timestamp: number) => {
    const today = new Date();
    const timeValue = new Date(timestamp);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return t("TIME_JUST");
    if (betweenTime < 60) {
      return `${betweenTime}${t("TIME_MINUTE")}`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}${t("TIME_HOUR")}`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 8) {
      return `${betweenTimeDay}${t("TIME_DAY")}`;
    }

    return `${Math.floor(betweenTimeDay / 7)}${t("TIME_WEEK")}`;
  };

  const timeToString2 = (timestamp: number) => {
    let date = new Date(timestamp);
    let monthName = date.toLocaleString("en-US", { month: "long" });
    let hours = date.getHours();
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let amPm = t("TIME_AM");

    if (hours >= 12) {
      amPm = t("TIME_PM");
      hours = hours - 12;
    }

    let timeString = amPm + " " + hours + ":" + minutes;
    let str = "";

    if (language[0] === "ko") {
      str =
        timeString +
        " · " +
        date.getFullYear() +
        "년 " +
        (date.getMonth() + 1) +
        "월 " +
        date.getDate() +
        "일";
    }
    if (language[0] === "en") {
      str =
        timeString +
        " · " +
        monthName +
        " " +
        date.getDate() +
        ", " +
        date.getFullYear();
    }

    return str;
  };

  const timeToString3 = (timestamp: number) => {
    let date = new Date(timestamp);
    let monthName = date.toLocaleString("en-US", { month: "long" });

    let str = "";

    if (language[0] === "ko") {
      str =
        date.getFullYear() +
        "년 " +
        (date.getMonth() + 1) +
        "월 " +
        date.getDate() +
        "일";
    }
    if (language[0] === "en") {
      str = monthName + " " + date.getDate() + ", " + date.getFullYear();
    }

    return str;
  };

  return { timeToString, timeToString2, timeToString3 };
};
