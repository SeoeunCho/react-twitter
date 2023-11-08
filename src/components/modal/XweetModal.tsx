import styled from "../modal/XweetModal.module.scss";
import Modal from "@mui/material/Modal";
import PostForm from "components/posts/PostForm";
import { GrClose } from "react-icons/gr";

export default function XweetModal({
  xweetModal,
  setXweetModal,
  toggleXweetModal,
}: any) {
  return (
    <Modal
      open={xweetModal}
      onClose={toggleXweetModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <div className={styled.topBox}>
          <div className={styled.close} onClick={toggleXweetModal}>
            <GrClose />
          </div>
        </div>
        <div className={styled.editInput__container}>
          <PostForm setXweetModal={setXweetModal} xweetModal={xweetModal} />
        </div>
      </div>
    </Modal>
  );
}
