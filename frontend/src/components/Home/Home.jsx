import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Layout from "../Layout/Layout";
import logo from "../../assets/logo2.png";

function Home() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => !prev);
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  return (
    <Layout center={true}>
      <div className="home">
        <img
          src={logo}
          alt=""
          className={`${rotation ? "rotation-slow" : ""}`}
        />
        <h1>Create a portfolio</h1>
        <button
          className="welcome-button"
          onClick={() => {
            navigate("/create");
          }}
        >
          Create
        </button>
      </div>
    </Layout>
  );
}

export default Home;
