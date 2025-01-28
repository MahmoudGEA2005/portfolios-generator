import "./Welcome.css";
import Actioncard from "../ActionCard/ActionCard";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigator = useNavigate();

  return (
    <Actioncard contentCentered={true}>
      <div className="welcome">
        <h1>Welcome</h1>
        <button
          className="welcome-button"
          onClick={() => navigator("/register")}
        >
          Sign Up
        </button>
        <p className="separator">or</p>
        <button className="welcome-button" onClick={() => navigator("/login")}>
          Log In
        </button>
      </div>
    </Actioncard>
  );
}

export default Welcome;
