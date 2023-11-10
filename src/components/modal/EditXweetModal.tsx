import styled from "./XweetModal.module.scss";
import Modal from "@mui/material/Modal";
import PostEditForm from "components/posts/PostEditForm";
import { GrClose } from "react-icons/gr";

export default function EditXweetModal({
  detailId,
  editModal,
  setEditModal,
}: {
  detailId: string;
  editModal: boolean;
  setEditModal: any;
}) {
  return (
    <Modal
      open={editModal}
      onClose={() => setEditModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <div className={styled.topBox}>
          <div className={styled.close} onClick={() => setEditModal(false)}>
            <GrClose />
          </div>
        </div>
        <div className={styled.editInput__container}>
          <PostEditForm detailId={detailId} editModal={editModal} setEditModal={setEditModal} />
        </div>
      </div>
    </Modal>
  );
}
