import "./Layout.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import topCR from "../../assets/top_cr.svg";
import bottomCR from "../../assets/bottom_cr.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

function Layout({ center, height, children }) {
  const navigate = useNavigate();
  const [theName, setName] = useState("");
  const [ulVisible, setUlVisible] = useState(false);
  const menu = useRef(null);

  const fetchName = async () => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/fetcher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ req: "username" }),
        }
      );
      if (response.ok) {
        try {
          const data = await response.json();
          setName(data["fname"]);
        } catch (error) {
          alert(`Unable to convert to JSON error: ${error}`);
        }
      }
    } catch (error) {
      alert(`Unable to fetch the username error: ${error}`);
    }
  };

  useEffect(() => {
    fetchName();
    const handleClickOutside = (event) => {
      if (menu.current && !menu.current.contains(event.target)) {
        setUlVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        setName("");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="layout">
      <img src={topCR} alt="" className="top-cr" />
      <img src={bottomCR} alt="" className="bottom-cr" />
      <div className="profile-container">
        <div className={`profile ${ulVisible ? "menu-opened" : ""}`} ref={menu}>
          <div
            className="profile-head"
            onClick={() => {
              setUlVisible((prev) => !prev);
            }}
          >
            <p>{theName}</p>
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
          <ul className={`profile-box ${ulVisible ? "menu-opened" : ""}`}>
            <li onClick={() => navigate("/dashboard")}>Dashboard</li>
            <li onClick={logout}>Log Out</li>
          </ul>
        </div>
      </div>
      <div
        className={`layout-card ${center ? "layout-children-center" : ""}`}
        style={{ height: height && height }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
