import { useEffect, useState } from "react";

export default function useTweetEditModalClick(etcRef: any) {
  const [tweetEtc, setTweetEtc] = useState(false);

  useEffect(() => {
    // tweetEct가 true면 return;으로 인해 함수 종료(렌더 후 클릭 시 에러 방지)
    if (!tweetEtc) return;

    const handleClick = (e: any) => {
      if (!etcRef.current.contains(e.target)) {
        setTweetEtc(false);
      } else if (etcRef.current === null) {
        return;
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [etcRef, tweetEtc]);

  return { tweetEtc, setTweetEtc };
}
