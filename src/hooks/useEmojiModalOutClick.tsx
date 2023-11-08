import { useEffect, useState } from "react";

export default function useEmojiModalOutClick({ emojiRef }: any) {
  const [clickEmoji, setClickEmoji] = useState(false);

  // 이모지 모달 밖 클릭 시 창 끔
  useEffect(() => {
    if (!clickEmoji) return;
    const handleClick = (e: any) => {
      // node.contains는 주어진 인자가 자손인지 아닌지에 대한 Boolean 값을 리턴함
      // emojiRef 내의 클릭한 영역의 타겟이 없으면 true
      if (!emojiRef.current.contains(e.target)) {
        setClickEmoji(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [clickEmoji, emojiRef]);

  const toggleEmoji = () => {
    setClickEmoji(!clickEmoji);
    if (clickEmoji) {
      setClickEmoji(true);
    }
  };

  return { clickEmoji, toggleEmoji };
}
