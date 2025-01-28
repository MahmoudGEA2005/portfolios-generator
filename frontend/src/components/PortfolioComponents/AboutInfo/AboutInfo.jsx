import React from "react";
import "./AboutInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SolidLinkBtn from "../SolidLinkBtn/SolidLinkBtn";
import TransLinkbtn from "../TransLinkbtn/TransLinkBtn";

export default function AboutInfo({ cards, links, children }) {
  return (
    <div className="about-info">
      <div className="cards">
        {cards.map((card) => (
          <div className="card" key={card.title}>
            <FontAwesomeIcon icon={card.icon} />
            <h3>{card.title}</h3>
            <p>{card.info}</p>
          </div>
        ))}
      </div>
      <div className="about-description">
        <p>{children}</p>
        <div className="btn-container">
          {links.map((link, index) =>
            index % 2 == 0 ? (
              <SolidLinkBtn key={`${link}-${index}`}>{link.name}</SolidLinkBtn>
            ) : (
              <TransLinkbtn key={`${link}-${index}`}>{link.name}</TransLinkbtn>
            )
          )}
        </div>
      </div>
    </div>
  );
}
