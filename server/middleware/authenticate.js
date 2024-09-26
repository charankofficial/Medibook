// const db = require("../db/conn");

// const authenticate = async (req, res, next) => {
//   try {
//     console.log(req.cookies.hospital_username);
//     const hospitalUsername = req.cookies.hospital_username; 
//     console.log(hospitalUsername);   
//     db.query(
//       'SELECT Hospital_ID, Username FROM hospital_table WHERE Username = ?',
//       [hospitalUsername],
//       async (error, results) => {
//         if (error) {
//           console.error('Error fetching hospital data:', error);
//           return res.status(500).json({ error: 'Internal Server Error' });
//         }
//         if (results.length === 0) {
//           throw new Error('Hospital not Found');
//         }
//         const hospital = results[0];
//         req.hospital = hospital;
//         req.hospitalID = hospital.Hospital_ID;
//         next();
//       }
//     );
//   } catch (err) {
//     res.status(401).send('Unauthorized: No Token Provided');
//     console.error(err);
//   }
// };

// module.exports = authenticate;

const jwt = require('jsonwebtoken');


// Your middleware function
const authenticate = async(req, res, next) => {
  // Extract the token from the request headers, cookies, or wherever you store it
  
 
  // Check if token is present
  // if (!token) {
  //   console.log("error!!!");
  //   return res.status(401).json({ error: 'Unauthorized - Missing token' });
  // }

  try {

    const token = req.cookies.hospital_token;
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.SECRET);

    console.log(decodedToken);
    // Attach the decoded token data to the request for further use
    req.hospital = {
      hospital_ID: decodedToken.hospital_ID,
      username: decodedToken.username,
    };
   req.hospital_ID = decodedToken.hospital_ID
    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticate;
