import "./Permissions.css";
import { useForm } from "react-hook-form";
import Toolkit from "../Toolkit/Toolkit";
import ActionBtn from "../ActionBtn/ActionBtn";

function Permissions({
  userRow,
  close,
  changeAdminData,
  fetchData,
  username,
  changeTab,
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: { permission: userRow.admin ? "true" : "false" },
  });

  const save = async (data) => {
    if (userRow.admin.toString() !== data.permission) {
      try {
        const response = await fetch(
          "https://nameless-oasis-38481-2bd1b8ebfc5e.herokuapp.com/admin",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              req: "change_permission",
              user_id: userRow.user_id,
              permission: data.permission === "true" ? true : false,
            }),
          }
        );
      } catch (e) {
        alert(`Error when accessing the admin endpoint: ${e}`);
      }
    }
    if (userRow.username === username) {
      changeAdminData(false);
      fetchData();
      changeTab(0);
    } else {
      changeAdminData(true);
    }
    close(null);
  };

  return (
    <Toolkit close={close}>
      <form onSubmit={handleSubmit(save)}>
        <div className="form-child-container">
          <label htmlFor="permission">Permission</label>
          <select
            {...register("permission")}
            id="permission"
            //   defaultValue={userRow.admin ? "true" : "false"}
          >
            <option value="true">Admin</option>
            <option value="false">Standard user</option>
          </select>
        </div>
        <ActionBtn>Save</ActionBtn>
      </form>
    </Toolkit>
  );
}

export default Permissions;
