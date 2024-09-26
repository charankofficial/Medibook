const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db/conn');
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');

// ---------------------------------------  Admin - Controls ----------------------------------------


// Admin - Login
router.post('/admin-login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const correctUserId = process.env.ADMIN_ID;
    const correctPassword = process.env.ADMIN_PASS;
    const isAuthenticated = userId === correctUserId && password === correctPassword;
    if (isAuthenticated) {
      console.log("Admin Login Successful");
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      console.log("Admin Login Failed");
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// To access all hospitals from hospital databases
router.get('/all-hospitals', (req, res) => {
    db.query('SELECT * FROM hospital_table', (error, results) => {
      if (error) throw error;
      res.json(results);
      console.log("Retreival successful from hospital_table");
    });
});



// To add a new hospital and map it to multiple specializations
router.post('/add-hospital', async (req, res) => {
  const { Hospital_name, Username, Location, password, address, Gmap, specializations } = req.body;
  try {
    const usernameExistsQuery = 'SELECT COUNT(*) AS count FROM hospital_table WHERE Username = ?';
    const usernameExistsResult = await queryAsync(usernameExistsQuery, [Username]);
    if (usernameExistsResult && usernameExistsResult[0].count > 0) {
      console.log("Username already exists");
      return res.status(400).json({ error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertHospitalQuery = 'INSERT INTO hospital_table (Hospital_name, Username, Location, password, address, Gmap) VALUES (?, ?, ?, ?, ?, ?)';
    const insertHospitalResult = await queryAsync(insertHospitalQuery, [Hospital_name, Username, Location, hashedPassword, address, Gmap]);
    if (insertHospitalResult && insertHospitalResult.insertId) {
      console.log('Hospital Added Successfully');
      const fetchHospitalQuery = 'SELECT Hospital_ID FROM hospital_table WHERE Username = ?';
      const hospitalResult = await queryAsync(fetchHospitalQuery, [Username]);
      if (hospitalResult && hospitalResult.length > 0) {
        const hospitalId = hospitalResult[0].Hospital_ID;
        for (const specialization of specializations) {
          const fetchSpecializationQuery = 'SELECT specialization_id FROM specialization_table WHERE specialization = ?';
          const specializationResult = await queryAsync(fetchSpecializationQuery, [specialization]);
          if (specializationResult && specializationResult.length > 0) {
            const specializationId = specializationResult[0].specialization_id;
            const insertMappingQuery = 'INSERT INTO mapping_table (specialization_id, hospital_id) VALUES (?, ?)';
            await queryAsync(insertMappingQuery, [specializationId, hospitalId]);
          } else {
            console.log(`Specialization '${specialization}' not found`);
          }
        }
        console.log('Mappings added to mapping_table successfully');
        res.json({ message: 'Hospital and mappings added successfully' });
      } else {
        console.log("Hospital not found");
        res.status(404).json({ error: 'Hospital not found' });
      }
    } else {
      console.log("Error adding hospital");
      res.status(500).json({ error: 'Error adding hospital' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Helper function to promisify the db.query function
function queryAsync(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// ---------------------------------------------- Hospital Management's access and Permission ------------------------------------------------------------

// // Hospital - signup
// router.post('/hospital-login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     db.query(
//       'SELECT Hospital_ID, Username, password FROM hospital_table WHERE Username = ?',
//       [username],
//       async (error, results) => {
//         if (error) {
//           console.error('Error fetching hospital data:', error);
//           return res.status(500).json({ error: 'Internal Server Error' });
//         }
//         if (results.length === 0) {
//           console.log("invalid");
//           return res.status(401).json({ error: 'Invalid credentials' });
//         }
//         const hospitalData = results[0];
//         const hashedPassword = hospitalData.password;
//         const passwordMatch = await bcrypt.compare(password, hashedPassword);
//         if (passwordMatch) {
//           console.log(username);
//           // res.cookie('hospital_username', username, { maxAge: (8*60*60) * 1000, httpOnly: true });
//           // res.cookie("hospital_username", username, { path: '/' },{ expires:new Date(Date.now()+ 25892000),httpOnly: true });
          
//           console.log("Cookie stored successfully");
//           console.log("Hospital-signup-success");
//           res.json({ message: 'Hospital signed up successfully', hospitalData });
//         } else {
//           console.log("Hospital-signup-failure");
//           res.status(401).json({ error: 'Invalid credentials' });
//         } 
//       }  
//     );
//   } catch (error) {
//     console.error('Error comparing passwords:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.post('/hospital-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    db.query(
      'SELECT Hospital_ID, Username, password FROM hospital_table WHERE Username = ?',
      [username],
      async (error, results) => {
        if (error) {
          console.error('Error fetching hospital data:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
          console.log("invalid");
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const hospitalData = results[0];
        const hashedPassword = hospitalData.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (passwordMatch) {
          const token = jwt.sign({ hospital_ID: hospitalData.Hospital_ID, username: hospitalData.Username }, process.env.SECRET, { expiresIn: '8h' });
          
          // Set the token in a cookie
          console.log(token);
          res.cookie('hospital_token', token, { maxAge: 8 * 60 * 60 * 1000, httpOnly: true });
          
          console.log("Token stored successfully");
          console.log("Hospital-signup-success");
          res.json({ message: 'Hospital signed up successfully', hospitalData, token });
        } else {
          console.log("Hospital-signup-failure");
          res.status(401).json({ error: 'Invalid credentials' });
        } 
      }  
    );
  } catch (error) {
    console.error('Error comparing passwords:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//Fetch - all doctors
router.get('/all-doctors', authenticate, async (req, res) => {
  try {
    const hospitalID = req.hospitalID; 
    db.query(
      'SELECT * FROM doctor_table WHERE hospital_ID = ?',
      [hospitalID],
      (error, results) => {
        if (error) {
          console.error('Error fetching doctors:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ doctors: results });
      }
    );
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err);
  }
});




// Fetch all specialization names 
router.get('/all-specializations',authenticate, async (req, res) => {
  try { 
    const hospitalID = req.Hospital_ID; 
    db.query(
      'SELECT specialization_ID FROM mapping_table WHERE hospital_ID = ?',
      [hospitalID],
      (error, results) => {
        if (error) {
          console.error('Error fetching specialization IDs:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        const specializationIDs = results.map(result => result.specialization_ID);
        db.query(
          'SELECT specialization FROM specialization_table WHERE specialization_ID IN (?)',
          [specializationIDs],
          (error, specializationResults) => {
            if (error) {
              console.error('Error fetching specialization names:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            const specializationNames = specializationResults.map(result => result.specialization);
            res.status(200).json({ specializations: specializationNames });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err);
  }
});




//Add doctor
router.post('/add-doctor',authenticate, async (req, res) => {
  try {
    const hospitalID = req.Hospital_ID; 
    const { doctor_name, specialization, available_days, OP_timing_In, OP_timing_Out } = req.body;
    db.query(
      'SELECT specialization_ID FROM specialization_table WHERE specialization = ?',
      [specialization],
      (error, specializationResults) => {
        if (error) {
          console.error('Error fetching specialization_ID:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (specializationResults.length === 0) {
          return res.status(400).json({ error: 'Specialization not found' });
        }
        const specializationID = specializationResults[0].specialization_ID;
        db.query(
          'INSERT INTO doctor_table (hospital_ID, specialization_ID, doctor_name, available_days, OP_timing_In, OP_timing_Out) VALUES (?, ?, ?, ?, ?, ?)',
          [hospitalID, specializationID, doctor_name, available_days, OP_timing_In, OP_timing_Out],
          (error, result) => {
            if (error) {
              console.error('Error adding doctor:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({ message: 'Doctor added successfully', doctorID: result.insertId });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err);
  }
});



//Fetch - all appointments
router.get('/all-appointments', authenticate, async (req, res) => {
  try {
    const hospitalID = req.hospitalID; 
    db.query(
      'SELECT * FROM appointment_table WHERE hospital_ID = ?',
      [hospitalID],
      (error, results) => {
        if (error) {
          console.error('Error fetching doctors:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ doctors: results });
      }
    );
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err);
  }
});

//To Book On-spot Appointment




module.exports = router;