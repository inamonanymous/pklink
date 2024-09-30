import { useEffect, useState } from "react";
import httpClient from "../../httpClient";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [villages, setVillages] = useState([]);
  const [brgyStreets, setBrgyStreets] = useState([]);

  useEffect(() => {
    handleBrgyStreets();
    handleVillages();
  }, []);

  const handleLocationType = (e) => {
    const value = e.target.value;
    setIsLocalResident(value === '2');
    setUserPrivateInfo(prevInfo => ({
      ...prevInfo,
      req_user_location_type: value === '2' ? "Local Resident" : "Village / Subdivision"
    }));
  };

  const handleVillages = async () => {
    try {
      const resp = await httpClient.get('/api/user/villages');
      if (resp.status === 200) {
        setVillages(resp.data);
      }
      console.log("villages", resp.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBrgyStreets = async () => {
    try {
      const resp = await httpClient.get('/api/user/brgystreets');
      if (resp.status === 200) {
        setBrgyStreets(resp.data);
        console.log("streets", resp.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [userBasicInfo, setUserBasicInfo] = useState({
    req_user_username: '',
    req_user_password: '',
    req_user_firstname: '',
    req_user_middlename: '',
    req_user_lastname: '',
    req_user_suffix: '',
    req_user_gender: '',
    req_user_photo_path: null,
  });

  const [userPrivateInfo, setUserPrivateInfo] = useState({
    req_user_location_type: '',
    req_user_brgy_street_id: '',
    req_user_village_id: '',
    req_user_house_number: '',
    req_user_lot_number: '',
    req_user_block_number: '',
    req_user_village_street: '',
    req_user_email_address: '',
    req_user_email_address2: '',
    req_user_phone_number: '',
    req_user_phone_number2: '',
    req_user_selfie_photo_path: null,
    req_user_gov_id_photo_path: null,
  });

  const [isLocalResident, setIsLocalResident] = useState(null);
  const [isValidEmail, setIsRegexValidEmail] = useState(false); 
  const [emailsMatch, setEmailsMatch] = useState(false);

  const handleBrgyStreetChange = (e) => {
    const value = e.target.value;
    setUserPrivateInfo((prevInfo) => ({
      ...prevInfo,
      req_user_brgy_street_id: value,
    }));
    console.log("Updated Brgy Street ID:", value);
  };
  
  const handleVillageChange = (e) => {
    const value = e.target.value;
    setUserPrivateInfo((prevInfo) => ({
      ...prevInfo,
      req_user_village_id: value,
    }));
    console.log("Updated village ID:", value);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUserPrivateInfo(prevInfo => ({
      ...prevInfo,
      [name]: files[0],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserBasicInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
    setUserPrivateInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInformationMerged = {
      ...userBasicInfo,
      ...userPrivateInfo
    };

    try {
      const resp = await httpClient.post('/api/user/registration', userInformationMerged, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (resp.status === 409) {
        alert('Username already exists');
        return;
      }
      if (resp.status !== 201) {
        alert('Invalid');
        return;
      }
      alert('User registration sent to server');
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('Error during registration');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setIsRegexValidEmail(validateEmail(email));
    setUserPrivateInfo(prevInfo => ({ ...prevInfo, req_user_email_address: email }));
  };

  const handleVerificationEmailChange = (e) => {
    const value = e.target.value;
    setEmailsMatch(value === userPrivateInfo.req_user_email_address);
    if (emailsMatch) {
      setUserPrivateInfo(prevInfo => ({ ...prevInfo, req_user_email_address2: value }));
    }
  };

 

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="req_user_username"
          value={userBasicInfo.req_user_username}
          onChange={handleInputChange}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          name="req_user_password"
          value={userBasicInfo.req_user_password}
          onChange={handleInputChange}
        />
        <br />
        <label>Firstname</label>
        <input
          type="text"
          name="req_user_firstname"
          value={userBasicInfo.req_user_firstname}
          onChange={handleInputChange}
        />
        <br />
        <label>Middlename</label>
        <input
          type="text"
          name="req_user_middlename"
          value={userBasicInfo.req_user_middlename}
          onChange={handleInputChange}
        />
        <br />
        <label>Lastname</label>
        <input
          type="text"
          name="req_user_lastname"
          value={userBasicInfo.req_user_lastname}
          onChange={handleInputChange}
        />
        <br />
        <label>Suffix</label>
        <input
          type="text"
          name="req_user_suffix"
          value={userBasicInfo.req_user_suffix}
          onChange={handleInputChange}
        />
        <br />
        <label>Gender</label>
        <input
          type="text"
          name="req_user_gender"
          value={userBasicInfo.req_user_gender}
          onChange={handleInputChange}
        />
        <br />
        <label>Photo Path</label>
        <input
          type="file"
          name="req_user_photo_path"
          onChange={handleFileChange}
        />
        <br />
        <label>Location type</label>
        <select name="req_user_location_type" onChange={handleLocationType}>
          <option selected disabled>--Select Location Type</option>
          <option value={1}>Village / Subdivision</option>
          <option value={2}>Local resident</option>
        </select>
        <br />
        <label>Enter House number</label>
        <input
          type="text"
          name="req_user_house_number"
          value={userPrivateInfo.req_user_house_number}
          onChange={handleInputChange}
        />
        <br />
        {isLocalResident == null ? (
          <p>Loading...</p>
        ) : isLocalResident ? (
          <>
            <label>Select Street</label>
            <select
              name="req_user_brgy_street_id"
              onChange={handleBrgyStreetChange}
              value={userPrivateInfo.req_user_brgy_street_id || ""}
            >
              <option selected>--Select Location Type</option>
              {brgyStreets.map(street => (
                <option key={street.id} value={street.id}>
                  {street.street_name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <label>Select Village</label>
            <select
              name="req_user_village_id"
              onChange={handleVillageChange}
              value={userPrivateInfo.req_user_village_id || ""}
              >
              <option>--Select Village--</option>
              {villages.map(village => (
                <option key={village.id} value={village.id}>
                  {village.village_name}
                </option>
              ))}
            </select>
            <br />
            <label>Village Street</label>
            <input
              type="text"
              name="req_user_village_street"
              onChange={handleInputChange}
            />
            <br />
            <label>Lot Number</label>
            <input
              type="text"
              name="req_user_lot_number"
              value={userPrivateInfo.req_user_lot_number}
              onChange={handleInputChange}
            />
            <br />
            <label>Block Number</label>
            <input
              type="text"
              name="req_user_block_number"
              value={userPrivateInfo.req_user_block_number}
              onChange={handleInputChange}
            />
          </>
        )}
        <br />
        <label>Email address</label>
        <input
          type="text"
          name="req_user_email_address"
          value={userPrivateInfo.req_user_email_address}
          onChange={handleEmailChange}
        />
        <br />
        <label>Re-enter Email address</label>
        <input
          type="text"
          name="req_user_email_address2"
          onChange={handleVerificationEmailChange}
        />
        <br />
        <label>Phone Number</label>
        <input
          type="text"
          name="req_user_phone_number"
          value={userPrivateInfo.req_user_phone_number}
          onChange={handleInputChange}
        />
        <br />
        <label>Phone Number 2</label>
        <input
          type="text"
          name="req_user_phone_number2"
          value={userPrivateInfo.req_user_phone_number2}
          onChange={handleInputChange}
        />
        <br />
        <label>Selfie Photo</label>
        <input
          type="file"
          name="req_user_selfie_photo_path"
          onChange={handleFileChange}
        />
        <br />
        <label>Government ID Photo</label>
        <input
          type="file"
          name="req_user_gov_id_photo_path"
          onChange={handleFileChange}
        />
        <br />
        {!emailsMatch && <p>Emails do not match</p>}
        {!isValidEmail && <p>Invalid email format</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
