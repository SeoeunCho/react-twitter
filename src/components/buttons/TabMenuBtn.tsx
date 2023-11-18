import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "./TabMenuBtn.module.scss";
import useTranslation from "hooks/useTranslation";

export default function TabMenuBtn({ url, text, selected, num }: any) {
  const [size, setSize] = useState(null);
  const t = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const check = url?.includes("profile");
    setSize(check);
  }, [url]);

  const goPage = (e: any) => {
    e.stopPropagation();
    navigate(`${url}`);
  };

  return (
    <div
      onClick={goPage}
      className={`${styled.tab__container} ${size && styled.sizeContainer}`}
    >
      <div
        className={`${styled.btnBox} ${selected === num && styled.selectedBox}`}
      >
        <p>{t(text)}</p>
      </div>
    </div>
  );
}
