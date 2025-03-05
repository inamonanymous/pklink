import { React, useState } from "react";
import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";

const CreateResidentTypeModal = ({ isResidentTypeModalOpen, setRefreshResidentTypes }) => {
  const [residentTypeData, setResidentTypeData] = useState({
    req_resident_type_name: "",
    req_manage_post: false,
    req_add_post: false,
    req_manage_event: false,
    req_add_event: false,
    req_manage_announcement: false,
    req_add_announcement: false,
    req_view_accounts: false,
    req_control_accounts: false,
    req_partial_admin: false,
    req_manage_request: false,
  });

  const descriptions = {
    req_manage_post: "Can edit and delete posts.",
    req_add_post: "Can create new posts.",
    req_manage_event: "Can edit and delete events.",
    req_add_event: "Can create new events.",
    req_manage_announcement: "Can edit and delete announcements.",
    req_add_announcement: "Can create new announcements.",
    req_view_accounts: "Can view user accounts.",
    req_control_accounts: "Can manage user roles and permissions.",
    req_partial_admin: "Has limited administrative privileges.",
    req_manage_request: "Can manage user requests.",
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setResidentTypeData((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      document.body.style.cursor = "wait";
      const resp = await httpClient.post("/api/admin/residenttype", residentTypeData);

      if (resp.status === 400) {
        Swal.fire("Error", "Bad Request", "error");
        return;
      }

      Swal.fire("Success", "Resident Type added successfully!", "success");

      document.getElementById("addResidentTypeForm").reset();
      setResidentTypeData({
        req_resident_type_name: "",
        req_manage_post: false,
        req_add_post: false,
        req_manage_event: false,
        req_add_event: false,
        req_manage_announcement: false,
        req_add_announcement: false,
        req_view_accounts: false,
        req_control_accounts: false,
        req_partial_admin: false,
        req_manage_request: false,
      });
      setRefreshResidentTypes((prev) => !prev);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", `${error.response.data.message}`, "error");
    } finally {
      document.body.style.cursor = "default";
    }
  };

  if (!isResidentTypeModalOpen) return null;

  return (
    <form onSubmit={handleSubmit} id="addResidentTypeForm">
      <div className="d-flex flex-column p-4">
        <h3 className="mb-4">Create Resident Type</h3>

        {/* Input for Resident Type Name */}
        <div className="mb-3">
          <input
            type="text"
            name="req_resident_type_name"
            placeholder="Enter Resident Type Name"
            value={residentTypeData.req_resident_type_name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        {/* Checkbox Grid */}
        <div className="mb-3">
          <div className="row row-cols-3">
            {Object.keys(residentTypeData).map(
              (key) =>
                key !== "req_resident_type_name" && (
                  <div key={key} className="col mb-2">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name={key}
                        checked={residentTypeData[key]}
                        onChange={handleInputChange}
                        className="form-check-input"
                        title={descriptions[key]} // Tooltip on hover
                      />
                      <label className="form-check-label" title={descriptions[key]}>
                        {key.replace("req_", "").replace(/_/g, " ")}
                      </label>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateResidentTypeModal;
