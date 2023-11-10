import { PostProps } from "pages/home";
import PostBox from "components/posts/PostBox";

export interface ReplyProps {
  id: string;
  reply: string;
  createdAt: any;
  uid: string;
  profileUrl: string | null;
  email: string;
  imageUrl: string;
  displayName: string;
}

interface ReplyBoxProps {
  data: ReplyProps;
  post: PostProps;
}

export default function ReplyBox({ data, post }: ReplyBoxProps) {
  return (
    <>
      <PostBox
        post={post}
        data={data}
        detailId={post.id}
        key={data.uid}
        postType={"reply"}
        detailPost={true}
      />
    </>
  );
}
