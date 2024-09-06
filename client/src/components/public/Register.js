import { useState } from "react";
import httpClient from "../../httpClient";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [villages, setVillages] = useState([]);
  const [brgyStreets, setBrgyStreets] = useState([]);

  const [userBasicInfo, setUserBasicInfo] = useState({
    'req_user_username': null,
    'req_user_password': null,
    'req_user_firstname': null,
    'req_user_middlename': null,
    'req_user_lastname': null,
    'req_user_suffix': null,
    'req_user_gender': null,
    'req_user_photo_path': null,
  });

  const [userPrivateInfo, setUserPrivateInfo] = useState({
    'req_user_location_type': null,
    'req_user_brgy_street_id': null,
    'req_user_village_id': null,
    'req_user_house_number': null,
    'req_user_lot_number': null,
    'req_user_block_number': null,
    'req_user_village_street': null,
    'req_user_email_address': null,
    'req_user_email_address2': null,
    'req_user_phone_number': null,
    'req_user_phone_number2': null,
    'req_user_selfie_photo_path': null,
    'req_user_gov_id_photo_path': null,
  });

  const [isLocalResident, setIsLocalResident] = useState(null);
  const [isValidEmail, setIsRegexValidEmail] = useState(false); 
  const [emailsMatch, setEmailsMatch] = useState(false);

  //merge userBasicInfo and userPrivateInfo object state variable
  const userInformationMerged = {
    ...userBasicInfo,
    ...userPrivateInfo
  }


   //handle post request to registration api server
   const handleSubmit = async(e) => {
     try {
      e.preventDefault();
      const resp = await httpClient.post('/api/user/registration', userInformationMerged);
      if (resp.status === 409){
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
    }

  };

  //populate input fields to object state variable 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserBasicInfo({
      ...userBasicInfo,
      [name]: value,
    });
    setUserPrivateInfo({
      ...userPrivateInfo,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setIsRegexValidEmail(validateEmail(email));
    setUserPrivateInfo({ ...userPrivateInfo, req_user_email_address: email});
  }
  
  const handleVerificationEmailChange = (e) => {
    const value = e.target.value;
    setEmailsMatch(value === userPrivateInfo.req_user_email_address);
    if (!emailsMatch){
      return;
    }
    setUserPrivateInfo({ ...userPrivateInfo, req_user_email_address2: value })
  };

  //handle select input if user is local resident or villager and set object state variable location type either
  const handleLocationType = (e) => {
    const value = e.target.value;
    if (value === '2') {  
      setIsLocalResident(true);
      setUserPrivateInfo(prevInfo => ({
          ...prevInfo,
          req_user_location_type: "Local Resident"  
      }));
    } else if (value === '1') {  
        setIsLocalResident(false); 
        setUserPrivateInfo(prevInfo => ({
            ...prevInfo,
            req_user_location_type: "Village / Subdivision" 
        }));
    }
    handleVillages();
    handleBrgyStreets();
    return;
  }

  //handle select input in villages
  const handleVillages = async() => {
    try {
      const resp = await httpClient.get('/api/user/villages');
      if (resp.status !== 200){
        return;
      }
      setVillages(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  //handle select input in brgy streets
  const handleBrgyStreets = async() => {
    try {
      const resp = await httpClient.get('/api/user/brgystreets');
      if (resp.status !== 200){
        return;
      }
      setBrgyStreets(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

 

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

              <label>Password</label>
              <input 
                  type="password"
                  name="req_user_password"
                  value={userBasicInfo.req_user_password}
                  onChange={handleInputChange}
              />

              <label>Firstname</label>
              <input 
                  type="text"
                  name="req_user_firstname"
                  value={userBasicInfo.req_user_firstname}
                  onChange={handleInputChange}
              />

              <label>Middlename</label>
              <input 
                  type="text"
                  name="req_user_middlename"
                  value={userBasicInfo.req_user_middlename}
                  onChange={handleInputChange}
              />

              <label>Lastname</label>
              <input 
                  type="text"
                  name="req_user_lastname"
                  value={userBasicInfo.req_user_lastname}
                  onChange={handleInputChange}
              />

              <label>Suffix</label>
              <input 
                  type="text"
                  name="req_user_suffix"
                  value={userBasicInfo.req_user_suffix}
                  onChange={handleInputChange}
              />

              <label>Gender</label>
              <input 
                  type="text"
                  name="req_user_gender"
                  value={userBasicInfo.req_user_gender}
                  onChange={handleInputChange}
              />

              <label>Photo Path</label>
              <input 
                  type="text"
                  name="req_user_photo_path"
                  value={userBasicInfo.req_user_photo_path}
                  onChange={handleInputChange}
              />
              <label>Location type</label>
              


              <select
                name="req_user_location_type"
                onChange={handleLocationType}
              >
                <option 
                  selected
                  disabled
                >--Select Location Type</option>
                <option value={1}>Village / Subdivision</option>
                <option value={2}>Local resident</option>
              </select>

              <label>Enter House number</label>
              <input 
                  type="text"
                  name="req_user_house_number"
                  value={userPrivateInfo.req_user_house_number}
                  onChange={handleInputChange}
              />
              {isLocalResident==null ? (
                <p>Loading...</p>
              )
              :
              isLocalResident==true ? (
              <>
                  <label>Select Street</label>
                  <select 
                      type="text"
                      name="req_user_brgy_street_id"
                      onChange={handleInputChange}
                      value={0}
                  >
                    <option>--Select Street--</option>
                    {brgyStreets.map(streets => (
                      <option key={streets.id} value={streets.id}>
                          {streets.street_name} {/* Adjust properties based on your API response */}
                      </option>
                    ))}
                  </select>

              </>
                
              ):(
                <>
                  <label>Select Village</label>
                  <select 
                      type="text"
                      name="req_user_village_id"
                      onChange={handleInputChange}
                      value={0}
                  >
                    <option>--Select Village--</option>
                    {villages.map(village => (
                      <option key={village.id} value={village.id}>
                          {village.village_name} {/* Adjust properties based on your API response */}
                      </option>
                    ))}
                  </select>

                  <label>Village Street</label>
                  <input 
                    type="text"
                    name="req_user_village_street"
                    value={userPrivateInfo.req_user_village_street}
                    onChange={handleInputChange}
                  />
                  <label>Lot Number</label>
                  <input 
                    type="text"
                    name="req_user_lot_number"
                    value={userPrivateInfo.req_user_lot_number}
                    onChange={handleInputChange}
                  />
                  <label>Block Number</label>
                  <input 
                    type="text"
                    name="req_user_block_number"
                    value={userPrivateInfo.req_user_block_number}
                    onChange={handleInputChange}
                  />
                </>
              )}

              <label>Email address</label>
              <input 
                type="text"
                name="req_user_email_address"
                value={userPrivateInfo.req_user_email_address}
                onChange={handleEmailChange}
              />

              <label>Re-enter Email address</label>
              <input 
                type="text"
                name="req_user_email_address2"
                onChange={handleVerificationEmailChange}
              />

              <label>Phone Number</label>
              <input 
                type="text"
                value={userPrivateInfo.req_user_phone_number}
                name="req_user_phone_number"
                onChange={handleInputChange}
              />

              <label>Phone number (optional))</label>
              <input 
                type="text"
                value={userPrivateInfo.req_user_phone_number2}
                name="req_user_phone_number2"
                onChange={handleInputChange}
              />

              <label>Upload Selfie</label>
              <input 
                type="text"
                name="req_user_selfie_photo_path"
                value={userPrivateInfo.req_user_selfie_photo_path}
                onChange={handleInputChange}
              />

              <label>Government ID</label>
              <input 
                type="text"
                name="req_user_gov_id_photo_path"
                value={userPrivateInfo.req_user_gov_id_photo_path}
                onChange={handleInputChange}
              />

              {!emailsMatch && <p>Emails do not match</p>}
              {!isValidEmail && <p>Invalid email format</p>}
              <button>
                Submit
              </button>
          </form>
      </div>
  );
}

  export default Register;
  