import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Welcome, Register, LogIn } from "./components/NewUserComponents";
import Home from "./components/Home/Home";
import Portfolio from "./components/PortfolioComponents/Portfolio/Portfolio.jsx";
import VerifyToken from "./components/VerifyToken/VerifyToken.jsx";
import CreatePortfolio from "./components/CreatePortfolio/CreatePortfolio.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <VerifyToken general="true">
              <Welcome />
            </VerifyToken>
          }
        />
        <Route
          path="/login"
          key="login"
          element={
            <VerifyToken general="true">
              <LogIn />
            </VerifyToken>
          }
        />
        <Route
          path="/Register"
          key="register"
          element={
            <VerifyToken general="true">
              <Register />
            </VerifyToken>
          }
        />
        <Route
          path="/home"
          element={
            <VerifyToken>
              <Home />
            </VerifyToken>
          }
        />
        <Route
          path="/create"
          element={
            <VerifyToken>
              <CreatePortfolio />
            </VerifyToken>
          }
        />
        <Route
          path="/portfolio"
          element={
            <VerifyToken>
              <Portfolio />
            </VerifyToken>
          }
        />
        <Route
          path="/dashboard"
          element={
            <VerifyToken>
              <Dashboard />
            </VerifyToken>
          }
        />
        {/* <Route path="/testing" element={<Testing />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
