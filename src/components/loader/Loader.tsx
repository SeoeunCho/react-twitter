import styled from "./Loader.module.scss";
import { AiOutlineTwitter } from "react-icons/ai";

export default function Loader() {
  return (
    <div className={styled.render__loading}>
      <AiOutlineTwitter className={styled.render__logo} />
    </div>
  );
}
