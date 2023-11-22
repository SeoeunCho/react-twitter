import { Oval } from "react-loader-spinner";
import styled from "./Loader.module.scss";

interface loaderProps {
  height?: number;
}

export default function CircleLoader({height}: loaderProps) {
  return (
    <div className={styled.container} style={{ marginTop: height }}>
      <Oval
        height={40}
        width={40}
        color="#4da0eb"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#a6d0f5"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
    </div>
  );
}
