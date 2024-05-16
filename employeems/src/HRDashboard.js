import React, { useState } from 'react';
import './HRDashboard.css'; // Import the CSS file

const HRDashboard = () => {
  const initialState = {
    name: '',
    age: '',
    gender: '',
    employeeId: '',
    photo: null,
    dob: '',
    bloodGroup: '',
    aadhaarAddress: '',
    maritalStatus: '',
    currentAddress:'',
    phone: '',
    email: '',
    languagesKnown: [],
    emergencyContacts: [
      { name: '', relationship: '', number: '' },
      { name: '', relationship: '', number: '' },
    ],
    previousExperience: {
      description: '',
      certificates: [],
    },
    currentSalary: '',
    department: '',
    storeLocation: '',
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    originalDocumentsSubmitted: false,
    dateOfJoining: '',
    kitIssued: '',
  };

  const [employeeData, setEmployeeData] = useState(initialState);
  const calculateAge = (dob) => {
    // Calculate age based on the DOB
    if (!dob) return '';
    
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
  
    if (type === 'file' && files && files.length > 0) {
      // Check file size
      const fileSizeLimit = 1024 * 1024; // 1 MB in bytes
      const file = files[0];
      if (file && file.size && file.size > fileSizeLimit) {
        alert('File size exceeds the limit of 1 MB.');
        return;
      }
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (name.includes('emergencyContacts')) {
      const [contactIndex, contactField] = name.split('.');
      setEmployeeData((prevData) => {
        const updatedContacts = prevData.emergencyContacts.map((contact, index) =>
          index === parseInt(contactIndex)
            ? { ...contact, [contactField]: value }
            : contact
        );
        return {
          ...prevData,
          emergencyContacts: updatedContacts,
        };
      });
    } else {
      setEmployeeData((prevData) => {
        const updatedData = {
          ...prevData,
          [name]: value,
        };

        // Update age if DOB is changed
        if (name === 'dob') {
          const age = calculateAge(value);
          updatedData.age = age;
        }

        return updatedData;
      });
    }
  };  
  const handleCertificateChange = (event) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      previousExperience: {
        ...prevData.previousExperience,
        certificates: [...prevData.previousExperience.certificates, ...event.target.files],
      },
    }));
  };
  const handleEmergencyContactChange = (index, event) => {
    const { name, value } = event.target;
    setEmployeeData((prevData) => {
      const updatedEmergencyContacts = [...prevData.emergencyContacts];
      updatedEmergencyContacts[index] = {
        ...updatedEmergencyContacts[index],
        [name]: value
      };
      return {
        ...prevData,
        emergencyContacts: updatedEmergencyContacts
      };
    });
  };
  
  

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic here (e.g., send data to backend)
    console.log('Employee data submitted:', employeeData);
    // Clear the form after submission (optional)
    setEmployeeData(initialState);
  };

  const handleReset = () => {
    setEmployeeData(initialState);
  };

  return (
    <div className="hr-dashboard">
      <h2>HR Dashboard</h2>
      <form onSubmit={handleSubmit} className="employee-form">
         {/* Name */}
         <div className="form-group">
          <label htmlFor="name">Name(As per Adhaar):</label>
          <input type="text" id="name" name="name" value={employeeData.name} onChange={handleChange} required />
        </div>

        

        {/* Gender */}
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" value={employeeData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Employee ID */}
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input type="text" id="employeeId" name="employeeId" value={employeeData.employeeId} onChange={handleChange} required />
        </div>

              {/* Photo */}
              <div className="form-group">
          <label htmlFor="photo">Photo:</label>
          <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} />
        </div>

        {/* DOB */}
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={employeeData.dob}
            onChange={(event) => {
              handleChange(event);
              const age = calculateAge(event.target.value);
              setEmployeeData((prevData) => ({
                ...prevData,
                age: age,
              }));
            }}required/>
        </div>
        {/* Age */}
          <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" value={employeeData.age} onChange={handleChange} required />
        </div>
        {/* Blood Group */}
        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <input type="text" id="bloodGroup" name="bloodGroup" value={employeeData.bloodGroup} onChange={handleChange} />
        </div>

        {/* Aadhaar Address */}
        <div className="form-group">
          <label htmlFor="aadhaarAddress">Address (As per Aadhaar):</label>
          <textarea id="aadhaarAddress" name="aadhaarAddress" value={employeeData.aadhaarAddress} onChange={handleChange} required />
        </div>

        {/* Marital Status */}
        <div className="form-group">
          <label htmlFor="maritalStatus">Marital Status:</label>
          <select id="maritalStatus" name="maritalStatus" value={employeeData.maritalStatus} onChange={handleChange} required>
            <option value="">Select Marital Status</option>
            <option value="Married">Married</option>
            <option value="Single">Single</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
          </select>
        </div>

        {/* Current Address */}
        <div className="form-group">
          <label htmlFor="currentAddress">Current Address:</label>
          <textarea id="currentAddress" name="currentAddress" value={employeeData.currentAddress} onChange={handleChange} required />
        </div>

        {/* Phone (already added in prescribed order) */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={employeeData.phone}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        {/* Email (already added in prescribed order) */}
        <div className="form-group">
          <label htmlFor="email">Email ID:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        {/* Languages Known (already added in prescribed order) */}
        <div className="form-group">
          <label htmlFor="languagesKnown">Languages Known (Select all that apply):</label>
          <br />
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="language-tamil"
              name="languagesKnown"
              value="Tamil"
              onChange={handleChange}
            />
            <label htmlFor="language-tamil">Tamil</label>
            <br />
            <input
              type="checkbox"
              id="language-english"
              name="languagesKnown"
              value="English"
              onChange={handleChange}
            />
            <label htmlFor="language-english">English</label>
            <br />
            <input
              type="checkbox"
              id="language-hindi"
              name="languagesKnown"
              value="Hindi"
              onChange={handleChange}
            />
            <label htmlFor="language-Hindi">Hindi</label>
            <br />
            <input
              type="checkbox"
              id="language-telugu"
              name="languagesKnown"
              value="Telugu"
              onChange={handleChange}
            />
            <label htmlFor="language-telugu">Telugu</label>
            <br />
            <input
              type="checkbox"
              id="language-malayalam"
              name="languagesKnown"
              value="Malayalam"
              onChange={handleChange}
            />
            <label htmlFor="language-malayalam">Malayalam</label>
            <br />
  {/* Add more checkboxes for other languages as needed */}
          </div>
        </div>

                {/* Emergency Contacts */}
<div className="form-group">
  <h3>Emergency Contacts</h3>
  <p>Add up to two emergency contacts.</p>
  {/* First Emergency Contact */}
  <div className="emergency-contact">
    <label htmlFor="emergency-contact-name-0">Name:</label>
    <input
      type="text"
      id="emergency-contact-name-0"
      name="emergencyContacts[0].name"
      value={employeeData.emergencyContacts[0].name}
      onChange={(event) => handleEmergencyContactChange(0, event)}
      required
    />
    <label htmlFor="emergency-contact-relationship-0">Relationship:</label>
    <input
      type="text"
      id="emergency-contact-relationship-0"
      name="emergencyContacts[0].relationship"
      value={employeeData.emergencyContacts[0].relationship}
      onChange={(event) => handleEmergencyContactChange(0, event)}
      required
    />
    <label htmlFor="emergency-contact-number-0">Phone Number:</label>
    <input
      type="tel"
      id="emergency-contact-number-0"
      name="emergencyContacts[0].number"
      value={employeeData.emergencyContacts[0].number}
      onChange={(event) => handleEmergencyContactChange(0, event)}
      required
    />
  </div>
  {/* Second Emergency Contact */}
  <div className="emergency-contact">
    <label htmlFor="emergency-contact-name-1">Name:</label>
    <input
      type="text"
      id="emergency-contact-name-1"
      name="emergencyContacts[1].name"
      value={employeeData.emergencyContacts[1].name}
      onChange={(event) => handleEmergencyContactChange(1, event)}
      required
    />
    <label htmlFor="emergency-contact-relationship-1">Relationship:</label>
    <input
      type="text"
      id="emergency-contact-relationship-1"
      name="emergencyContacts[1].relationship"
      value={employeeData.emergencyContacts[1].relationship}
      onChange={(event) => handleEmergencyContactChange(1, event)}
      required
    />
    <label htmlFor="emergency-contact-number-1">Phone Number:</label>
    <input
      type="tel"
      id="emergency-contact-number-1"
      name="emergencyContacts[1].number"
      value={employeeData.emergencyContacts[1].number}
      onChange={(event) => handleEmergencyContactChange(1, event)}
      required
    />
  </div>
</div>

       {/* Previous Experience */}
<div className="form-group">
  <h3>Previous Experience</h3>
  <label htmlFor="previousExperienceDescription">Description:</label>
  <textarea
    id="previousExperienceDescription"
    name="previousExperience.description"
    value={employeeData.previousExperience.description}
    onChange={handleChange}
    required
  />
  <label htmlFor="previousExperienceCertificates">Upload Certificates (optional):</label>
  <input
    type="file"
    id="previousExperienceCertificates"
    name="previousExperience.certificates"
    multiple
    onChange={handleCertificateChange}
  />
</div>


        {/* Current Salary */}
        <div className="form-group">
          <label htmlFor="currentSalary">Current Salary (₹):</label>
          <input
            type="number"
            id="currentSalary"
            name="currentSalary"
            value={employeeData.currentSalary}
            onChange={handleChange}
            required
          />
        </div>

        {/* Department */}
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select id="department" name="department" value={employeeData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            {/* Add more options for departments as needed */}
          </select>
        </div>

        {/* Store Location */}
        <div className="form-group">
          <label htmlFor="storeLocation">Store Location:</label>
          <select id="storeLocation" name="storeLocation" value={employeeData.storeLocation} onChange={handleChange} required>
            <option value="">Select Store Location</option>
            <option value="Ondipudur">Ondipudur</option>
            <option value="SaiBabaColony">SaiBaba Colony</option>
            <option value="Kalapatti">Kalapatti</option>
            {/* Add more options for store locations as needed */}
          </select>
        </div>

        {/* Aadhaar Documents */}
        <div className="form-group">
          <h3>Aadhaar Documents</h3>
          <label htmlFor="aadhaarFront">Aadhaar Card (Front):</label>
          <input type="file" id="aadhaarFront" name="aadhaarFront" accept="image/*" onChange={handleChange} required />
          <label htmlFor="aadhaarBack">Aadhaar Card (Back):</label>
          <input type="file" id="aadhaarBack" name="aadhaarBack" accept="image/*" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="panCard">PAN Card (optional):</label>
          <input type="file" id="panCard" name="panCard" accept="image/*" onChange={handleChange} />
        </div>

        {/* Original Documents Submitted */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              id="originalDocumentsSubmitted"
              name="originalDocumentsSubmitted"
              checked={employeeData.originalDocumentsSubmitted}
              onChange={handleChange}
            />
            Original Documents Submitted
          </label>
        </div>

        {/* Date of Joining */}
        <div className="form-group">
          <label htmlFor="dateOfJoining">Date of Joining:</label>
          <input type="date" id="dateOfJoining" name="dateOfJoining" value={employeeData.dateOfJoining} onChange={handleChange} required />
        </div>

        {/* Kit Issued */}
        <div className="form-group">
          <label htmlFor="kitIssued">Kit Issued (Select all that apply):</label>
          <br />
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="kit-uniform"
              name="kitIssued"
              value="uniform"
              onChange={handleChange}
            />
            <label htmlFor="kit-uniform">Uniform</label>
            <br />
            <input
              type="checkbox"
              id="kit-id-card"
              name="kitIssued"
              value="idCard"
              onChange={handleChange}
            />
            <label htmlFor="kit-id-card">ID Card</label>
            <br />
            <input
              type="checkbox"
              id="kit-laptop"
              name="kitIssued"
              value="laptop"
              onChange={handleChange}
            />
            <label htmlFor="kit-laptop">Laptop</label>
            <br />
            {/* Add more checkboxes for other kit items as needed */}
          </div>
        </div>
        {/* Submit and Reset buttons */}
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit Employee Data
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};
export default HRDashboard;