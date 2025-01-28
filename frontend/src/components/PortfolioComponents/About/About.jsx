import React from 'react';
import "./About.css";
import AboutPic from '../AboutPic/AboutPic';
import AboutInfo from '../AboutInfo/AboutInfo';

export default function About({img, cards, links, children}) {
  return (
    <div className='about-section'>
      <AboutPic img={img} />
      <AboutInfo cards={cards} links={links}>{children}</AboutInfo>
    </div>
  )
}
