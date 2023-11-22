import { useEffect, useState } from "react";
import { RiArrowUpSLine } from "react-icons/ri";
import { throttle } from "lodash";
import { useLocation } from "react-router-dom";
import styled from "./TopButton.module.scss";

export default function TopButton() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [topBtnStatus, setTopBtnStatus] = useState<boolean>(false); // 버튼 상태
  const navigate = useLocation();

  const handleFollow = throttle(() => {
    if (window.scrollY > 500) {
      setTopBtnStatus(true);
    } else {
      setTopBtnStatus(false);
    }
    setScrollY(window.scrollY);
  }, 200);

  // 위로 가기
  useEffect(() => {
    window.addEventListener("scroll", handleFollow);

    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  }, [handleFollow]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate.pathname]);

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setScrollY(0); // scrollY 의 값을 초기화
    if (scrollY === 0) {
      setTopBtnStatus(false);
    }
  };

  return (
    <div
      onClick={handleTop} // 버튼 클릭시 함수 호출
      className={`${styled.container} ${
        topBtnStatus ? styled.container__show : styled.container__hide
      }`}
    >
      <button className={styled.btn}>
        <RiArrowUpSLine />
      </button>
    </div>
  );
}
