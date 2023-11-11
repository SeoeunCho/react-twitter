import { useState } from "react";
import useHandleOutsideClick from "./useHandleOutsideClick";

export default function useEmojiModalOutClick({ emojiRef }: any) {
  const [clickEmoji, setClickEmoji] = useState(false);

  // 이모지 모달 밖 클릭 시 창 끔
  useHandleOutsideClick({
    ref: emojiRef,
    isModal: clickEmoji,
    setIsModal: setClickEmoji,
  });

  const toggleEmoji = () => {
    setClickEmoji(!clickEmoji);
    if (clickEmoji) {
      setClickEmoji(true);
    }
  };

  return { clickEmoji, toggleEmoji };
}
