import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import Actioncard from "../ActionCard/ActionCard";
import InputField from "../InputFiled/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCircleUser,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const formInputs = [
  {
    type: "text",
    name: "fname",
    placeholder: "First Name",
    icon: faAddressCard,
  },
  {
    type: "text",
    name: "lname",
    placeholder: "Last Name",
    icon: faAddressCard,
  },
  {
    type: "text",
    name: "username",
    placeholder: "Username",
    icon: faCircleUser,
  },
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
  {
    type: "password",
    name: "cpassword",
    placeholder: "Confirm Password",
    icon: faLock,
  },
];

function Register() {
  const [passMisMatch, setPassMisMatch] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      terms: false,
    },
  });

  const [username, email] = watch(["username", "email"]);

  useEffect(() => {
    if (!username) {
      setUsernameExists(false);
    }
    if (!email) {
      setEmailExists(false);
    }
  }, [username, email]);

  const handleSubmitM = (data) => {
    setPassMisMatch(false);
    setUsernameExists(false);
    setEmailExists(false);
    const { password, cpassword } = data;
    if (password != cpassword) {
      return setPassMisMatch(true);
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fetch("https://nameless-oasis-38481-2bd1b8ebfc5e.herokuapp.com/register", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        try {
          if (result[0]["state"] == "errors") {
            result.slice(1).forEach((error) => {
              switch (error["error_type"]) {
                case "username_found":
                  setUsernameExists(true);
                  break;
                case "email_found":
                  setEmailExists(true);
                  break;
                case "password_match":
                  setPassMisMatch(true);
                  break;
                case "terms":
                  setTerms(true);
                  break;
              }
              return;
            });
          }
        } catch (e) {
          navigate("/home");
        }
      })
      .catch((error) => alert(`Couldn't register you error: ${error}`));
  };

  return (
    <Actioncard>
      <div className="form-card">
        <h1>Register</h1>
        <p className="light-text">
          Create your account, it&apos;s free and only takes a minute
        </p>
        <form onSubmit={handleSubmit(handleSubmitM)}>
          <div className="fields">
            {formInputs.map((inp) => (
              <div className="input-box" key={inp.name}>
                <InputField
                  inp={inp}
                  register={register}
                  usedFor="registration"
                />
                {inp.name === "username" && usernameExists ? (
                  <p className="error">Username exists</p>
                ) : inp.name === "email" && emailExists ? (
                  <p className="error">This email is already registered</p>
                ) : (
                  ""
                )}
                {errors[inp.name] && (
                  <p className="error">{errors[inp.name].message}</p>
                )}
              </div>
            ))}
            {passMisMatch ? (
              <p className="error">Passwords don&apos;t match</p>
            ) : (
              ""
            )}
          </div>
          <div
            className={`check-not ${
              terms || errors.terms ? "against-terms" : undefined
            }`}
          >
            <input
              type="checkbox"
              {...register("terms", {
                required: "You should agree to the terms and conditions",
              })}
              id="not"
              tabIndex="0"
            />
            <label className="light-text" htmlFor="not">
              I accept the Terms of Use and Privacy Policy
            </label>
          </div>
          <div className="submit">
            <p className="light-text">
              Already a member?
              <span className="linker" onClick={() => navigate("/login")}>
                Sign In
              </span>
            </p>
            <input type="submit" value="SIGN UP" className="welcome-button" />
          </div>
          <div className="sign-with-flag">
            <p className="light-text">or sign up with</p>
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

export default Register;
