import styled from "./TweetModal.module.scss";
import Modal from "@mui/material/Modal";
import PostEditForm from "components/posts/PostEditForm";
import ReplyEditForm from "components/reply/ReplyEditForm";
import { GrClose } from "react-icons/gr";



export default function EditTweetModal({
  detailId,
  postType,
  editModal,
  setEditModal,
}: {
  detailId: string;
  postType: string;
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
          {postType === "tweet" && (
            <PostEditForm
              detailId={detailId}
              editModal={editModal}
              setEditModal={setEditModal}
            />
          )}
          {postType === "reply" && (
            <ReplyEditForm
              detailId={detailId}
              editModal={editModal}
              setEditModal={setEditModal}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
