import Icon from "@ant-design/icons";
import React from "react";

const HeartSvg = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25 5L28.8333 8.83333L24.0167 13.6167L26.3833 15.9833L31.1667 11.1667L35 15V5H25ZM5 15L8.83333 11.1667L13.6167 15.9833L15.9833 13.6167L11.1667 8.83333L15 5H5V15ZM15 35L11.1667 31.1667L15.9833 26.3833L13.6167 24.0167L8.83333 28.8333L5 25V35H15ZM35 25L31.1667 28.8333L26.3833 24.0167L24.0167 26.3833L28.8333 31.1667L25 35H35V25Z"
      fill="white"
    ></path>
  </svg>
);
const HeartIcon = ({ passedState, passedSetState }) => {
  return (
    <Icon
      component={HeartSvg}
      style={{
        zIndex: "1",
        position: "absolute",
        top: "0",
        right: "0",
        color: "#fff",
        background: "#00000052",
      }}
      onClick={() => passedSetState({...passedState, 'status': true})}
    />
  );
};
const CustomZoomIcon = ({ passedState, passedSetState }) => {
  return (
    <HeartIcon
      style={{ color: "hotpink" }}
      passedSetState={passedSetState}
      passedState={passedState}
    />
  );
};

export default CustomZoomIcon;
