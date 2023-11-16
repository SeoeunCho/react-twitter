import { TweetProps } from "pages/home";
import TweetBox from "components/tweets/TweetBox";

export interface ReplyProps {
  id: string;
  tweetId: string;
  email: string;
  content: string;
  createdAt: any;
  uid: string;
  profileUrl: string | null;
  likes?: string[];
  likeCount?: number;
  imageUrl: string;
  displayName: string;
}

interface ReplyBoxProps {
  reply: ReplyProps[];
  tweet: TweetProps;
  detailId: string | null;
  tweetType: string;
  detailTweet: boolean;
}

export default function ReplyBox({
  reply,
  tweet,
  detailId,
  tweetType,
  detailTweet,
}: ReplyBoxProps) {
  return (
    <>
      {reply &&
        reply?.map((item: ReplyProps, index: number) => (
          <TweetBox
            tweet={tweet}
            reply={item}
            detailId={item.id}
            key={index}
            tweetType={"reply"}
            detailTweet={true}
          />
        ))}
    </>
  );
}
