import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllSpecializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        // Make a request to your server's endpoint to fetch specializations
        const response = await axios.get('http://localhost:4000/all-specializations');

        // Assuming the server responds with an array of specialization names
        setSpecializations(response.data.specializations);
        setLoading(false);
      } catch (error) {
        // Handle error
        setError('Error fetching specializations');
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  return (
    <div>
      <h2>Specializations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {specializations.map((specialization, index) => (
            <li key={index}>{specialization}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllSpecializations;
