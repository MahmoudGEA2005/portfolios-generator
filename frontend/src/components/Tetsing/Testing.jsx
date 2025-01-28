import "./Testing.css";
import Actioncard from "../ActionCard/ActionCard.jsx";
import Nav from "../Nav/Nav.jsx";
import portfolioDesign from "../../assets/portfolio.png";

function Testing() {
  return (
    
  );
}

export default Testing;




<div className="home">
      <div className="container">
        <Nav username={aUsername}></Nav>
        <div className="home-box">
          <div className="landing">
            <div className="portfolio-design">
              <img src={portfolioDesign} alt="" />
            </div>
            <div className="landing-desc">
              <h1>Build your portfolio</h1>
              <p>Fill the form of your information and get a portfolio</p>
              <button className="welcome-button">Create</button>
            </div>
          </div>
        </div>
        <div className="user">
          {userId}{" "}
          <button
            onClick={() => {
              logout();
              navigateMain();
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>