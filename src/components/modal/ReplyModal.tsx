import styled from "./TweetModal.module.scss";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import ReplyForm, { ReplyPropsBox } from "components/reply/ReplyForm";

export default function ReplyModal({
  userObj,
  tweetObj,
  replyModal,
  setReplyModal,
}: any) {
  return (
    <Modal
      open={replyModal}
      onClose={() => setReplyModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <div className={styled.topBox}>
          <div className={styled.close} onClick={() => setReplyModal(false)}>
            <GrClose />
          </div>
        </div>
        <div className={styled.editInput__container}>
          <ReplyForm
            userObj={userObj}
            tweetObj={tweetObj}
            replyModal={replyModal}
            setReplyModal={setReplyModal}
          />
        </div>
      </div>
    </Modal>
  );
}
