import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./CreatePortfolio.css";
import Layout from "../Layout/Layout.jsx";
import design from "../../assets/portfolio.png";
import LabelledInput from "../LabelledInput/LabelledInput.jsx";
import { formFields } from "./data.js";

const portfolioDesign = [
  {
    imgPath: design,
  },
  {
    imgPath: design,
  },
];

function CreatePortfolio() {
  const [selectedDesign, setSelectedDesign] = useState([true, null]);
  const [faddingOut, setFaddingOut] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersPorts, setUsersPorts] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUsersPorts = async () => {
      try {
        const response = await fetch(
          "https://nameless-oasis-38481-2bd1b8ebfc5e.herokuapp.com/fetcher",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ req: "users_ports" }),
          }
        );
        if (response.ok) {
          try {
            const data = await response.json();
            setUsersPorts(data["users_ports"]);
            setLoading(false);
          } catch (e) {
            alert(`Faild to jsonify your data error: ${e}`);
          }
        }
      } catch (e) {
        alert(`Error Fetching your templates error: ${e}`);
      }
    };
    fetchUsersPorts();
  }, []);

  const sumbitAction = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "picture" && value instanceof FileList) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(
        "https://nameless-oasis-38481-2bd1b8ebfc5e.herokuapp.com/create",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      if (response.ok) {
        navigate("/portfolio");
      }
    } catch (e) {
      alert(`Faild to connect to the server error: ${e}`);
    }
  };

  const selectDesign = (index) => {
    setFaddingOut(selectedDesign[1]);
    setTimeout(
      () => {
        if (usersPorts.includes(index + 1)) {
          setSelectedDesign([false, index]);
        } else {
          setSelectedDesign([true, index]);
        }
      },
      selectedDesign[1] !== null ? 999 : 0
    );
    setTimeout(() => {
      setFaddingOut(null);
    }, 1050);
  };

  const jsxElements = [
    <div
      className={`create-content ${faddingOut === 0 ? "fade-out" : ""}`}
      key={`design-${selectedDesign[1]}`}
    >
      <form
        onSubmit={handleSubmit(sumbitAction)}
        encType="multipart/form-data"
        key="cretea-form"
      >
        <input type="hidden" {...register("design_id")} value="1" />
        {formFields.map((field) => (
          <LabelledInput
            field={field}
            key={field.name}
            error={errors[field.name]}
            register={register}
          />
        ))}
        <input type="submit" value="Create" className="welcome-button" />
      </form>
    </div>,
    <div
      className={`create-content ${faddingOut === 1 ? "fade-out" : ""}`}
      key={`design-${selectedDesign[1]}`}
    >
      <div>Comming Soon</div>
    </div>,
  ];

  return (
    <Layout
      height={
        selectedDesign[0] && selectedDesign[1] === 0 ? "2146px" : undefined
      }
    >
      {!loading ? (
        <div className="create-card">
          <h1>Create a Potfolio</h1>
          <div className="portfolio-design">
            <p>Pick a design</p>
            <div className="portfolio-designs-lst">
              {portfolioDesign.map((design, index) => (
                <div
                  key={`design-${index + 1}`}
                  className={`img-upper-container ${
                    selectedDesign[1] === index ? "img-selected" : undefined
                  }`}
                >
                  <div className="portfolio-design-img-container">
                    <img
                      src={design.imgPath}
                      alt={`design-${index + 1}`}
                      onClick={() => {
                        selectDesign(index);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!selectedDesign[0] ? (
            <div className="exist">
              You already have the Template {selectedDesign[1] + 1}, see in the{" "}
              <button className="go-to" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
            </div>
          ) : (
            jsxElements[selectedDesign[1]]
          )}
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </Layout>
  );
}

export default CreatePortfolio;
