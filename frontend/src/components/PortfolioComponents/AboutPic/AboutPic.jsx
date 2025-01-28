import React from "react";
import "./AboutPic.css";

export default function AboutPic({ img }) {
  return (
    <div className="about-pic">
      <img src={img[0]} alt={img[1]} />
    </div>
  );
}
