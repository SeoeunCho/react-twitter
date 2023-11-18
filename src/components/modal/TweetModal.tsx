import styled from "../modal/TweetModal.module.scss";
import Modal from "@mui/material/Modal";
import TweetForm from "components/tweets/TweetForm";
import { GrClose } from "react-icons/gr";

export default function TweetModal({
  tweetModal,
  userObj,
  setTweetModal,
  toggleTweetModal,
}: any) {
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
          <TweetForm
            userObj={userObj}
            tweetModal={tweetModal}
            setTweetModal={setTweetModal}
          />
        </div>
      </div>
    </Modal>
  );
}
