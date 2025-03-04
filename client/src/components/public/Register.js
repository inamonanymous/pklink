import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import httpClient from "../../httpClient";
import { useNavigate, Link } from "react-router-dom";

function Register({ onRegistrationSuccess }) {
  const navigate = useNavigate();

  const [villages, setVillages] = useState([]);
  const [brgyStreets, setBrgyStreets] = useState([]);

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    
  }, []);

  const handleLocationType = (e) => {
    const value = e.target.value;
    setIsLocalResident(value === '2');
    setUserPrivateInfo(prevInfo => ({
      ...prevInfo,
      req_user_location_type: value === '2' ? "Local Resident" : "Village / Subdivision"
    }));
    handleBrgyStreets();
    handleVillages();
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
    req_user_birthday: '',
    req_user_civil_status: '',
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

  const handleBasicFileChange = (e) => {
    const { name, files } = e.target;
    setUserBasicInfo(prevInfo => ({
      ...prevInfo,
      [name]: files[0],
    }));
  };

  const handlePrivateFileChange = (e) => {
    const { name, files } = e.target;
    setUserPrivateInfo(prevInfo => ({
      ...prevInfo,
      [name]: files[0],
    }));
  };

  const handleBasicInputChange = (e) => {
    const { name, value } = e.target;
    setUserBasicInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePrivateInputChange = (e) => {
    const { name, value } = e.target;
    setUserPrivateInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Define all expected fields (ensuring missing values are set as an empty string)
    const allFields = {
      req_user_username: userBasicInfo.req_user_username ?? "",
      req_user_password: userBasicInfo.req_user_password ?? "",
      req_user_firstname: userBasicInfo.req_user_firstname ?? "",
      req_user_middlename: userBasicInfo.req_user_middlename ?? "",
      req_user_lastname: userBasicInfo.req_user_lastname ?? "",
      req_user_suffix: userBasicInfo.req_user_suffix ?? "", 
      req_user_gender: userBasicInfo.req_user_gender ?? "",
      req_user_house_number: userPrivateInfo.req_user_house_number ?? "",
      req_user_brgy_street_id: userPrivateInfo.req_user_brgy_street_id ?? "",
      req_user_village_id: userPrivateInfo.req_user_village_id ?? "",
      req_user_village_street: userPrivateInfo.req_user_village_street ?? "",
      req_user_lot_number: userPrivateInfo.req_user_lot_number ?? "",
      req_user_block_number: userPrivateInfo.req_user_block_number ?? "",
      req_user_email_address: userPrivateInfo.req_user_email_address ?? "",
      req_user_phone_number: userPrivateInfo.req_user_phone_number ?? "",
      req_user_phone_number2: userPrivateInfo.req_user_phone_number2 ?? "",
      req_user_birthday: userPrivateInfo.req_user_birthday ?? "",
      req_user_civil_status: userPrivateInfo.req_user_civil_status ?? "",
    };
  
    // Append text fields to FormData
    Object.entries(allFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    // Append file fields separately (if present)
    if (userBasicInfo.req_user_photo_path) {
      formData.append('req_user_photo_path', userBasicInfo.req_user_photo_path);
    }
    if (userPrivateInfo.req_user_selfie_photo_path) {
      formData.append('req_user_selfie_photo_path', userPrivateInfo.req_user_selfie_photo_path);
    }
    if (userPrivateInfo.req_user_gov_id_photo_path) {
      formData.append('req_user_gov_id_photo_path', userPrivateInfo.req_user_gov_id_photo_path);
    }
  
    // Debugging: Log FormData values
    console.log("FormData Entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      document.body.style.cursor = 'wait';
      const resp = await httpClient.post('/api/user/registration', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (resp.status === 409) {
        Swal.fire('Failed!', 'Username already exists', 'error');
        return;
      }
  
      if (resp.status !== 201) {
        Swal.fire('Failed!', 'Invalid request', 'error');
        return;
      }
  
      Swal.fire('Success!', 'User Registration complete', 'success');
      onRegistrationSuccess();
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Error during registration', 'error');
    } finally {
      document.body.style.cursor = 'default';
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
    <>
      {isAllowed ? (
        
      
    <div>
      <form onSubmit={handleSubmit} className='flex-col'>
        <div className='input-con flex-col'>
          <label>Username</label>
          <input
            type="text"
            name="req_user_username"
            value={userBasicInfo.req_user_username}
            required
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Password</label>
          <input
            type="password"
            name="req_user_password"
            required
            value={userBasicInfo.req_user_password}
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Firstname</label>
          <input
            type="text"
            name="req_user_firstname"
            required
            value={userBasicInfo.req_user_firstname}
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Middlename</label>
          <input
            type="text"
            name="req_user_middlename"
            value={userBasicInfo.req_user_middlename}
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Lastname</label>
          <input
            type="text"
            name="req_user_lastname"
            required
            value={userBasicInfo.req_user_lastname}
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Suffix</label>
          <input
            type="text"
            name="req_user_suffix"
            value={userBasicInfo.req_user_suffix}
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Gender</label>
          <input
            type="text"
            name="req_user_gender"
            required
            value={userBasicInfo.req_user_gender}
            onChange={handleBasicInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Photo Path</label>
          <input
            type="file"
            name="req_user_photo_path"
            onChange={handleBasicFileChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Location type</label>
          <select 
          name="req_user_location_type" 
          onChange={handleLocationType}
          required
          >
            <option selected disabled>--Select Location Type</option>
            <option value={1}>Village / Subdivision</option>
            <option value={2}>Local resident</option>
          </select>
        </div>

        <div className='input-con flex-col'>
          <label>Enter House number</label>
          <input
            type="text"
            name="req_user_house_number"
            required
            value={userPrivateInfo.req_user_house_number}
            onChange={handlePrivateInputChange}
          />
        </div>

        {isLocalResident == null ? (
          <p>Loading...</p>
        ) : isLocalResident ? (
          <div className='input-con flex-col'>
            <label>Select Street</label>
            <select
              name="req_user_brgy_street_id"
              required
              onChange={handleBrgyStreetChange}
              value={userPrivateInfo.req_user_brgy_street_id || ""}
            >
              <option selected>--Select Location Type</option>

              {brgyStreets === null ? (
                <option>No results</option>
              ) : (
                brgyStreets.map(street => (
                  <option key={street.id} value={street.id}>
                    {street.street_name}
                  </option>
                ))
              )}
            </select>
          </div>
        ) : (
          <>
            <div className='input-con flex-col'>
              <label>Select Village</label>
              <select
                name="req_user_village_id"
                required
                onChange={handleVillageChange}
                value={userPrivateInfo.req_user_village_id || ""}
              >
                <option>--Select Village--</option>
                {villages === null || villages.length === 0 ? (
                  <option>No results</option>
                ) : (
                  villages.map(village => (
                    <option key={village.id} value={village.id}>
                      {village.village_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className='input-con flex-col'>
              <label>Village Street</label>
              <input
                type="text"
                required
                name="req_user_village_street"
                onChange={handlePrivateInputChange}
              />
            </div>

            <div className='input-con flex-col'>
              <label>Lot Number</label>
              <input
                type="text"
                name="req_user_lot_number"
                required
                value={userPrivateInfo.req_user_lot_number}
                onChange={handlePrivateInputChange}
              />
            </div>

            <div className='input-con flex-col'>
              <label>Block Number</label>
              <input
                type="text"
                name="req_user_block_number"
                required
                value={userPrivateInfo.req_user_block_number}
                onChange={handlePrivateInputChange}
              />
            </div>
          </>
        )}

        <div className='input-con flex-col'>
          <label>Date of birth</label>
          <input
            type="date"
            name="req_user_birthday"
            required
            value={userPrivateInfo.req_user_birthday}
            onChange={handlePrivateInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Civil Status</label>
          <select 
            name="req_user_civil_status"
            required
            value={userPrivateInfo.req_user_civil_status}
            onChange={handlePrivateInputChange}
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        <div className='input-con flex-col'>
          <label>Email address</label>
          <input
            type="text"
            name="req_user_email_address"
            required
            value={userPrivateInfo.req_user_email_address}
            onChange={handleEmailChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Re-enter Email address</label>
          <input
            type="text"
            name="req_user_email_address2"
            required
            onChange={handleVerificationEmailChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Phone Number</label>
          <input
            type="text"
            name="req_user_phone_number"
            required
            value={userPrivateInfo.req_user_phone_number}
            onChange={handlePrivateInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Phone Number 2</label>
          <input
            type="text"
            name="req_user_phone_number2"
            value={userPrivateInfo.req_user_phone_number2}
            onChange={handlePrivateInputChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Selfie Photo</label>
          <input
            type="file"
            name="req_user_selfie_photo_path"
            required
            onChange={handlePrivateFileChange}
          />
        </div>

        <div className='input-con flex-col'>
          <label>Government ID Photo</label>
          <input
            type="file"
            name="req_user_gov_id_photo_path"
            required
            onChange={handlePrivateFileChange}
          />
        </div>

        {!emailsMatch && <p>Emails do not match</p>}
        {!isValidEmail && <p>Invalid email format</p>}
        <button 
          type="submit"
          disabled={!emailsMatch || !isValidEmail}
          >
            Register
          </button>
      </form>
    </div>
    ) : (
      <div className="text-con">
          <h5>Do you live inside Puting Kahoy, Silang Cavite</h5>
          <div className="btns-con flex-col">
            <button
              onClick={() => {setIsAllowed(true)}}
            >
              Yes
            </button>
            <Link to={'/'}>
              <button
                className="reject"
              >
                No
              </button>
            </Link>
          </div>
      </div>
    )}
  </>
  );
}

export default Register;
