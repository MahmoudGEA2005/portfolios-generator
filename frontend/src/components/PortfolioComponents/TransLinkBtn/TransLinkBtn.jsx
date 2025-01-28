import React from "react";
import "./TransLinkbtn.css";

function TransLinkbtn({ children, ...proxy }) {
  return (
    <a href="" className="trans-link-btn" {...proxy}>
      {children}
    </a>
  );
}

export default TransLinkbtn;
