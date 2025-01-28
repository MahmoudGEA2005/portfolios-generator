import React from "react";
import "./SolidLinkbtn.css";

function SolidLinkBtn({ children, ...proxy }) {
  return (
    <a href="" className="solid-link-btn" {...proxy}>
      {children}
    </a>
  );
}

export default SolidLinkBtn;
