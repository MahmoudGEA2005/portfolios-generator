import React from "react";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SolidLinkBtn from "../SolidLinkBtn/SolidLinkBtn.jsx";
import TransLinkBtn from "../TransLinkbtn/TransLinkBtn.jsx";

export default function Header({ headerData }) {
  return (
    <header>
      <div className="me-icons">
        {headerData.links.map((link) => (
          <a href={link.href} key={link.href}>
            <FontAwesomeIcon icon={link.icon} />
          </a>
        ))}
        <div className="v-line"></div>
      </div>
      <div className="about">
        <p>Hello I'm</p>
        <h1>{headerData.intro.name}</h1>
        <p>{headerData.intro.title}</p>
        <div className="links">
          <TransLinkBtn>Download CV</TransLinkBtn>
          <SolidLinkBtn>Let's talks</SolidLinkBtn>
        </div>
      </div>
      <div className="dev">
        <p>{headerData.wordLogo}</p>
      </div>
    </header>
  );
}
