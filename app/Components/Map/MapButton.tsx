import React from "react";

interface Props {
  submitClassName: string;
  ismarkeronmap: boolean;
}
const MapButton = ({ submitClassName, ismarkeronmap }: Props) => {
  return (
    <div>
      <button
        id="button"
        style={{
          transition: "width 0.3s ease, height 0.3s ease",
          zIndex: "5",
        }}
        className={submitClassName}
      >
        {ismarkeronmap ? "SUBMIT" : "PLACE MARKER ON THE MAP"}
      </button>
    </div>
  );
};

export default MapButton;
