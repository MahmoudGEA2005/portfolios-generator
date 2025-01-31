import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Dashboard.css";
import topCR from "../../assets/top_cr.svg";
import bottomCR from "../../assets/bottom_cr.svg";
import { formFields0 } from "./data";
import design from "../../assets/portfolio.png";
import ghost from "../../assets/ghost.png";
import LabelledInput from "../LabelledInput/LabelledInput";
import Permissions from "../Permissions/Permissions";
import Toolkit from "../Toolkit/Toolkit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ActionBtn from "../ActionBtn/ActionBtn";

const portfolioDesign = [
  {
    imgPath: design,
  },
  {
    imgPath: design,
  },
];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [usersPorts, setUsersPorts] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [faddingOut, setFaddingOut] = useState(null);
  const [portoflioImg, setPortfolioImg] = useState("");
  const [adminData, setAdminData] = useState([]);
  const [permissionPannel, setPermissionsPannel] = useState(null);
  const [deleteUserPrompt, setDeleteUserPrompt] = useState(null);
  const [tableHeight, setTableHeight] = useState();
  const [updated, setUpdated] = useState([false, undefined]);
  const tableRef = useRef();
  const navigate = useNavigate();

  const templateForm = useForm();
  const userDataForm = useForm();

  useEffect(() => {
    if (tableRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setTableHeight(entries[0].contentRect.height);
      });
      resizeObserver.observe(tableRef.current);
    }
  }, [tableRef.current]);

  const fetchUsersPorts = async () => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/fetcher",
        {
          method: "POST",
          credentials: "same-origin",
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
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/fetcher",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ req: "user_data" }),
        }
      );
      if (response.ok) {
        try {
          const data = await response.json();
          const { admin, id, password, user_id, ...coreData } = data;
          userDataForm.reset(coreData);
          setUserData(data);
        } catch (e) {
          alert(`Faild to jsonify your data error: ${e}`);
        }
      }
    } catch (e) {
      alert(`Error Fetching your data error: ${e}`);
    }
  };
  useEffect(() => {
    fetchUsersPorts();
    fetchUserData();
  }, []);

  const fetchUserTemplateData = async (designId) => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/data",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ req: "user_templates", design_id: designId }),
        }
      );
      if (response.ok) {
        try {
          const data = await response.json();
          const { user_id, id, picture, ...coreData } = data.data;
          setPortfolioImg(picture);
          templateForm.reset(coreData);
        } catch (e) {
          alert(`Faild to jsonify your data error: ${e}`);
        }
      }
    } catch (e) {
      alert(`Error Fetching your data error: ${e}`);
    }
  };

  const userDataList = [
    {
      labelName: "First Name",
      name: "fname",
      type: "text",
    },
    {
      labelName: "Last Name",
      name: "lname",
      type: "text",
    },
    {
      labelName: "Username",
      name: "username",
      type: "text",
    },
    {
      labelName: "Email Address",
      name: "email",
      type: "email",
    },
  ];

  const logout = async () => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/logout",
        {
          method: "POST",
          credentials: "same-origin",
        }
      );
      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const templateSubmitAction = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "picture" && value instanceof FileList) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });
    formData.append("request", "design1");
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/update",
        {
          method: "POST",
          credentials: "same-origin",
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

  const updateUserData = async (data) => {
    const sentData = new FormData();
    sentData.append("request", "change_user_data");
    Object.entries(data).forEach(([key, value]) => {
      if (userData[key] != value) {
        sentData.append(key, value);
      }
    });
    let counter = 0;
    sentData.forEach(() => counter++);
    if (counter > 1) {
      try {
        const response = await fetch(
          "https://portfolios-generator.onrender.com/api/update",
          {
            method: "POST",
            credentials: "same-origin",
            body: sentData,
          }
        );
        if (response.ok) {
          fetchUserData();
          setUpdated([true, "updated"]);
          setTimeout(() => {
            setUpdated([false, undefined]);
          }, 1700);
        } else {
          setUpdated([true, "update-error"]);
          setTimeout(() => {
            setUpdated([false, undefined]);
          }, 1700);
        }
      } catch (e) {
        alert(`Unable to connect to the server ${e}`);
      }
    } else {
      setUpdated([true, "nothing"]);
      setTimeout(() => {
        setUpdated([false, undefined]);
      }, 1700);
    }
  };

  const selectDesign = (index) => {
    setFaddingOut(selectedDesign);
    setTimeout(
      () => {
        if (usersPorts.includes(index + 1)) {
          setSelectedDesign(index);
        } else {
          setSelectedDesign(index);
        }
      },
      selectedDesign !== null ? 999 : 0
    );
    setTimeout(() => {
      setFaddingOut(null);
    }, 1050);
  };

  const dashMenu = ["Profile", "Templates", "Admin"];

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPortfolioImg(imgUrl);
    }
  };

  const templatesFroms = [
    <div
      className={`create-content ${faddingOut === 0 ? "fade-out" : ""}`}
      key={`design-${selectedDesign}`}
    >
      <form
        onSubmit={templateForm.handleSubmit(templateSubmitAction)}
        encType="multipart/form-data"
        key="cretea-form"
      >
        <input
          type="hidden"
          {...templateForm.register("design_id")}
          value="1"
        />
        <div className="flex-isolater">
          <label htmlFor="picture">
            <div className="img-submit">
              <img src={portoflioImg} alt="portoflio Img" />
            </div>
          </label>
          <input
            type="file"
            {...templateForm.register("picture")}
            id="picture"
            accept="image/*"
            onChange={handleImgChange}
          />
        </div>
        {formFields0.map((field) => (
          <LabelledInput
            field={field}
            key={field.name}
            error={templateForm.formState.errors[field.name]}
            register={templateForm.register}
            extraClass={field.type === "textarea" ? "expand" : undefined}
          />
        ))}
        <div className="submit-container">
          <input type="submit" value="View" className="welcome-button" />
        </div>
      </form>
    </div>,
    <div
      className={`create-content ${faddingOut === 1 ? "fade-out" : ""}`}
      key={`design-${selectedDesign}`}
    >
      <div>Comming Soon</div>
    </div>,
  ];
  const tabs = [
    <div key="tab-0">
      <h1>User Data</h1>
      <div className="user-data">
        <form onSubmit={userDataForm.handleSubmit(updateUserData)}>
          {userDataList.map((field, index) => (
            <LabelledInput
              field={field}
              register={userDataForm.register}
              error={userDataForm.formState.errors[field.name]}
              key={`user-data-${index}`}
              readOnly={field.name === "username" ? true : false}
            />
          ))}
          <ActionBtn additionalClass="user-data-btn">Save</ActionBtn>
        </form>
      </div>
    </div>,
    <div key="tab-1">
      <p>take a look</p>
      <h1>Your templates</h1>
      <div className="tab-content">
        <div className="templates">
          {portfolioDesign.map(
            (design, index) =>
              usersPorts.includes(index + 1) && (
                <img
                  src={design.imgPath}
                  key={`design-${index}`}
                  onClick={() => {
                    fetchUserTemplateData(index + 1);
                    selectDesign(index);
                  }}
                />
              )
          )}
        </div>
        {templatesFroms[selectedDesign]}
      </div>
    </div>,
    <div key="tab-2">
      <h1>Admin pannel</h1>
      <table className="admin-table" ref={tableRef}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Username</th>
            <th>Permissions</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((row, index) => (
            <tr key={`row-id-${row.id}`}>
              <td data-cell="no.">{index + 1}</td>
              <td data-cell="username">
                {row.username}
                {row.username === userData.username && " (You)"}
              </td>
              <td data-cell="permissions">
                {row.admin ? (
                  <span
                    className="admin"
                    onClick={() => {
                      setPermissionsPannel(row);
                    }}
                  >
                    Admin <FontAwesomeIcon icon={faPen} />
                  </span>
                ) : (
                  <span
                    className="standard-user"
                    onClick={() => {
                      setPermissionsPannel(row);
                    }}
                  >
                    Standard user <FontAwesomeIcon icon={faPen} />
                  </span>
                )}
              </td>
              <td data-cell="delete">
                <ActionBtn
                  additionalClass="del"
                  onClick={() => setDeleteUserPrompt(row)}
                >
                  Delete
                </ActionBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
  ];

  const callAdmin = async (isAdmin) => {
    if (isAdmin) {
      try {
        const response = await fetch(
          "https://portfolios-generator.onrender.com/api/admin",
          {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ req: "users_data" }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          data.users.sort((a, b) => a.id - b.id);
          setAdminData(data.users);
        }
      } catch (e) {
        alert(`Faild to make an admin request error: ${e}`);
      }
    } else {
      setAdminData([]);
    }
  };

  const deleteUser = async (targetUser, currentUsername) => {
    try {
      const response = await fetch(
        "https://portfolios-generator.onrender.com/api/admin",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            req: "delete_user",
            user_id: targetUser.user_id,
          }),
        }
      );
      if (response.ok) {
        setDeleteUserPrompt(null);
        if (currentUsername == targetUser.username) {
          callAdmin(false);
          setUserData({});
          logout();
        } else {
          callAdmin(userData.admin);
        }
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      {updated[0] && (
        <div className={`status-box ${updated[1]}`}>
          {updated[1] === "nothing" ? "There is nothing to update" : updated[1]}
        </div>
      )}
      {deleteUserPrompt && (
        <Toolkit close={setDeleteUserPrompt}>
          <div className="q-box">
            <p>
              Delete {deleteUserPrompt.username}
              {deleteUserPrompt.username === userData.username && " (You)"} ?
            </p>
            <div className="btn-container">
              <ActionBtn
                additionalClass="cancel"
                onClick={() => setDeleteUserPrompt(null)}
              >
                Cancel
              </ActionBtn>
              <ActionBtn
                onClick={() => {
                  deleteUser(deleteUserPrompt, userData.username);
                }}
                additionalClass="del"
              >
                Delete
              </ActionBtn>
            </div>
          </div>
        </Toolkit>
      )}
      {permissionPannel && (
        <Permissions
          userRow={permissionPannel}
          changeAdminData={callAdmin}
          close={setPermissionsPannel}
          fetchData={fetchUserData}
          username={userData.username}
          changeTab={setCurrentTab}
        />
      )}
      <div className="layout">
        <img src={topCR} alt="" className="top-cr" />
        <img src={bottomCR} alt="" className="bottom-cr" />
        <div
          className={`layout-card dashboard-card ${
            currentTab === 1 && selectedDesign === 0 ? "design1-card" : ""
          }`}
          style={{
            height: currentTab === 2 ? `${tableHeight + 400}px` : undefined,
            marginBlock: "50px",
          }}
        >
          <div className="dash-menu">
            <img src={ghost} alt="" />
            <h1>Dashboard</h1>
            <ul>
              {dashMenu.map(
                (ele, index) =>
                  (ele !== "Admin" || (ele === "Admin" && userData.admin)) && (
                    <li
                      className={currentTab === index ? "active" : undefined}
                      onClick={() => {
                        setCurrentTab(index);
                        if (ele === "Admin") {
                          callAdmin(userData.admin);
                        }
                      }}
                      key={`menu-link-${index}`}
                    >
                      {ele}
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className={`dash-content ${currentTab === 0 && "main-tab"}`}>
            {tabs[currentTab]}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
