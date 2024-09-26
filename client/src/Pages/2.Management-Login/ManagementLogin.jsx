import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import swal2 from 'sweetalert2';
import './ManagementLogin.css'

const ManagementLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/hospital-login', {
        username: username,
        password: password,
      },{withCredentials: true});

      console.log('Login successful:', response.data);

      swal2.fire({
        position: 'top-end',
        title: 'Login Successful !',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'my-custom-popup-class',
          title: 'my-custom-title-class',
          content: 'my-custom-content-class',
          timerProgressBar:'progress-bar',
        },
        didOpen: () => {
          swal2.showLoading();
          const b = swal2.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            b.textContent = swal2.getTimerLeft();
          }, 100);
        },
        }).then((result) => {
        if (result.dismiss === swal2.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
        }); 

        navigate('./specializations');
      
    } 
    catch (error) {
      
      swal2.fire({
        position: 'top-end',
        title: 'Login failed !',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'my-custom-popup-class',
          title: 'my-custom-title-class',
          content: 'my-custom-content-class',
          timerProgressBar:'progress-bar',
        },
        didOpen: () => {
          swal2.showLoading();
          const b = swal2.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            b.textContent = swal2.getTimerLeft();
          }, 100);
        },
        }).then((result) => {
        if (result.dismiss === swal2.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
        }); 

        console.error('Login failed:', error.response.data);
    }
  };
  return (
  <>
    <div className='H-Login-panel'>
      <h2>Management Portal</h2>
      <form onSubmit={handleLogin}>
        <div className='H-Login-item'>
          
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='H-Login-input' placeholder='Your Username'/>
        </div>
        
        <div className='H-Login-item'>
          
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='H-Login-input' placeholder='Your Password'/>
        </div>
        <div className='H-Login-item-2'>
        <button type="submit" className='H-Login-Button'>Login</button>
        </div>
      </form>
      
    </div>
    </>
  );
};

export default ManagementLogin;
