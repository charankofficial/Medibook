import React from 'react'
import {Routes, Route} from "react-router-dom"

// Pages
import AdminLogin from './Pages/1.Admin-Login/AdminLogin'
import ManagementsDB from './Pages/1.Management-DB/ManagementsDB'
import ManagementSignup from './Pages/1.Management-Signup/ManagementSignup'
import AddDoctor from './Pages/2.Add-Doctor/AddDoctor'
import AllDoctors from './Pages/2.All-Doctors/AllDoctors'
import AllSpecializations from './Pages/2.All-Specializations/AllSpecializations'
import DynamicSpecializationDoctors from './Pages/2.Dynamic-Specialization-doctors/DynamicSpecializationDoctors'
import ManagementLogin from './Pages/2.Management-Login/ManagementLogin'
import PatientHistory from './Pages/2.Patient-History/PatientHistory'

const Routing = () =>
{
  return(
    <Routes>     
      <Route path="/" element={<ManagementLogin/>} /> 
      <Route path="/admin-login" element={<AdminLogin/>} /> 
      <Route path="/management-db" element={<ManagementsDB/>} /> 
      <Route path="/management-signup" element={<ManagementSignup/>} /> 
      <Route path="/add-doctor" element={<AddDoctor/>} /> 
      <Route path="/all-doctors" element={<AllDoctors/>} /> 
      <Route path="/specializations" element={<AllSpecializations/>} /> 
      <Route path="/specializations:id/doctors" element={<DynamicSpecializationDoctors/>} /> 
      <Route path="/patient-history" element={<PatientHistory/>} /> 
    </Routes>
  )
}

const App = () => {
 
  return (
    <>
      <Routing/>
    </> 
  )
}

export default App