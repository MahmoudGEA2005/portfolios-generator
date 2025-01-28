import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import Actioncard from "../ActionCard/ActionCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const formInputs = [
  {
    type: "email",
    name: "email",
    placeholder: "Email",
    icon: faEnvelope,
  },
  {
    type: "password",
    name: "password",
    placeholder: "Password",
    icon: faLock,
  },
];

function LogIn() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [email, password] = watch(["email", "password"]);

  const handleSubmitM = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fetch("https://nameless-oasis-38481-2bd1b8ebfc5e.herokuapp.com/login", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        try {
          setEmailError("");
          setPasswordError("");
          if (result[0]["state"] === "errors") {
            result.slice(1).forEach((error) => {
              switch (error["error_type"]) {
                case "empty_email":
                  setEmailError(["email", error["message"]]);
                  break;
                case "empty_password":
                  setPasswordError(["password", error["message"]]);
                  break;
                case "incorrect_password":
                  setPasswordError(["password", error["message"]]);
                  break;
                case "not_user":
                  setEmailError(["email", error["message"]]);
                  break;
              }
              return;
            });
          }
        } catch (e) {
          navigate("/Home");
        }
      })
      .catch((error) => alert(`Unable to log in: ${error}`));
  };

  useEffect(() => {
    if (!email) {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("");
    }
  }, [email, password]);

  return (
    <Actioncard>
      <div className="form-card">
        <h1>Log In</h1>
        <p className="light-text">Log In to your account</p>
        <form onSubmit={handleSubmit(handleSubmitM)}>
          <div className="fields">
            {formInputs.map((inp) => (
              <div className="input-box" key={inp.name}>
                <div className="input-container">
                  <input
                    type={inp.type}
                    {...register(inp.name, {
                      required: `${inp.name} can'tr be empty`,
                    })}
                    placeholder={inp.placeholder}
                  />
                  <FontAwesomeIcon icon={inp.icon} />
                </div>
                {errors[inp.name] && (
                  <p className="error">{errors[inp.name].message}</p>
                )}
                {inp.name === emailError[0] && (
                  <p className="error">{emailError[1]}</p>
                )}
                {inp.name === passwordError[0] && (
                  <p className="error">{passwordError[1]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="submit">
            <p className="light-text">
              Don&apos;t have an account ?{" "}
              <span className="linker" onClick={() => navigate("/register")}>
                Sign Up
              </span>
            </p>
            <input type="submit" value="LOG IN" className="welcome-button" />
          </div>
          <div className="sign-with-flag">
            <p className="light-text">or sign in with</p>
          </div>
          <div className="sign-with-links">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </form>
      </div>
    </Actioncard>
  );
}

export default LogIn;
