import React from "react";

interface Props {
  submitClassName: string;
}
const MapButton = ({ submitClassName }: Props) => {
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
        PLACE MARKER ON THE MAP
      </button>
    </div>
  );
};

export default MapButton;
