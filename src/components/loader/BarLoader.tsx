import styled from "./Loader.module.scss";

interface CountProps {
  count?: number;
}

export default function BarLoader({ count }: CountProps) {
  return (
    <div className={styled.loader}>
      <div
        className={styled.loader__bar}
        style={{
          width: `${count}%`,
        }}
      />
    </div>
  );
}
