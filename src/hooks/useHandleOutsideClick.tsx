import { useEffect, useState } from "react";

type handleOutsideClickProps = {
  ref: React.RefObject<HTMLElement>;
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useHandleOutsideClick({
  ref,
  isModal,
  setIsModal,
}: handleOutsideClickProps) {
  // ref.current에 담긴 엘리먼트의 외부영역 클릭 시 모달창 닫힘
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isModal &&
        ref?.current &&
        !ref?.current.contains(e.target as HTMLElement)
      ) {
        setIsModal(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref, isModal, setIsModal]);

  return { isModal, setIsModal };
}
