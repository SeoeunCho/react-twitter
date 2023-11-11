import { PostProps } from "pages/home";
import PostBox from "components/posts/PostBox";

export interface ReplyProps {
  id: string;
  postId: string;
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
  post: PostProps;
  detailId: string;
  postType: string;
  detailPost: boolean;
}

export default function ReplyBox({
  reply,
  post,
  detailId,
  postType,
  detailPost,
}: ReplyBoxProps) {
  return (
    <>
      {reply &&
        reply?.map((item: ReplyProps, index: number) => (
          <PostBox
            post={post}
            reply={item}
            detailId={item.id}
            key={index}
            postType={"reply"}
            detailPost={true}
          />
        ))}
    </>
  );
}
