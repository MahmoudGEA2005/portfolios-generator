import "./ActionCard.css";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import wavy from "../../assets/wavy.svg";
import wavyh from "../../assets/wavyh.png";
import logo from "../../assets/ghost.png";

function Actioncard({ contentCentered, children }) {
  const [rotate, setRotation] = useState(false);
  const [wavyHTop, setWavyHTop] = useState("100%");
  const wavyHRef = useRef(null);
  const [imgReady, setImgReady] = useState(false);
  const actionContent = useRef(null);
  const [cardsHeight, setCardsHeight] = useState(700);

  const setWHTop = () => {
    if (wavyHRef.current) {
      const calculatedTop = `calc(300px - ${wavyHRef.current.offsetHeight}px + 4px)`;
      setWavyHTop(calculatedTop);
    }
  };

  const imgLoaded = () => {
    setImgReady(true);
  };

  // Listen for the changing of the SVG height to set top

  useLayoutEffect(() => {
    if (actionContent.current) {
      setCardsHeight(actionContent.current.offsetHeight);
    }
  }, [actionContent.current?.offsetHeight]);

  // Setup to recalculate the height whenever the image height changes or window resizes
  useLayoutEffect(() => {
    if (imgReady) {
      setWHTop(); // Initial positioning once image is loaded

      const handleResize = () => {
        setWHTop(); // Recalculate on resize
      };

      // Attach resize listener
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [imgReady]); // Only runs after the image has loaded

  // When the height of the image changes, it triggers the position recalculation
  useLayoutEffect(() => {
    setWHTop(); // Recalculate position when height changes
  }, [wavyHRef.current?.offsetHeight]); // Dependency on the current offsetHeight

  // Apply a rotation animation to the logo each 1500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="action-card">
      <div className="action-card-box">
        <div style={{ height: `${cardsHeight}px` }}>
          <img
            src={logo}
            alt=""
            className={`logo ${rotate ? "rotation" : ""}`}
          />
          <h1>Portfolio Creator</h1>
          <p>Generate a portfolio for you</p>
        </div>
        <img src={wavy} alt="" className="wavy" />
        <img
          src={wavyh}
          alt=""
          className="wavy-h"
          ref={wavyHRef}
          style={{ top: wavyHTop }}
          onLoad={imgLoaded}
        />
        <div
          ref={actionContent}
          className={contentCentered ? "content-centered" : ""}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Actioncard;
