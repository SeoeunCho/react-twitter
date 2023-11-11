import styled from "../modal/TweetModal.module.scss";
import Modal from "@mui/material/Modal";
import PostForm from "components/posts/PostForm";
import { GrClose } from "react-icons/gr";

export default function TweetModal({ tweetModal, setTweetModal }: any) {
  return (
    <Modal
      open={tweetModal}
      onClose={() => setTweetModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <div className={styled.topBox}>
          <div className={styled.close} onClick={() => setTweetModal(false)}>
            <GrClose />
          </div>
        </div>
        <div className={styled.editInput__container}>
          <PostForm tweetModal={tweetModal} setTweetModal={setTweetModal} />
        </div>
      </div>
    </Modal>
  );
}
