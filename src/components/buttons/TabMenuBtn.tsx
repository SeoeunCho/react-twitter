import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "./TabMenuBtn.module.scss";
import useTranslation from "hooks/useTranslation";

export default function TabMenuBtn({ url, text, selected, num }: any) {
  const [size, setSize] = useState(null);
  const t = useTranslation();

  useEffect(() => {
    const check = url?.includes("profile");
    setSize(check);
  }, [url]);

  return (
    <Link
      to={url}
      className={`${styled.tab__container} ${size && styled.sizeContainer}`}
    >
      <div
        className={`${styled.btnBox} ${selected === num && styled.selectedBox}`}
      >
        <p>{t(text)}</p>
      </div>
    </Link>
  );
}
