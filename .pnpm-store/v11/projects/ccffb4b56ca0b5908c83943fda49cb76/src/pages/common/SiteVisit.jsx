// import React, { useState, useEffect } from 'react';

// const SiteVisit = () => {
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [timer, setTimer] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);
//   const [visitedPlaces, setVisitedPlaces] = useState([]);

//   // Start Timer function
//   const startTimer = () => {
//     const id = setInterval(() => {
//       setTimer((prevTimer) => prevTimer + 1);
//     }, 1000); // Timer increases every second
//     setIntervalId(id);
//   };

//   // Stop Timer function
//   const stopTimer = () => {
//     clearInterval(intervalId);
//     setIntervalId(null);
//   };

//   // Function to fetch the current location
//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const lat = position.coords.latitude;
//           const lon = position.coords.longitude;
//           setLatitude(lat);
//           setLongitude(lon);
//           fetchLocationName(lat, lon);
//           startTimer(); // Start the timer when location is fetched
//         },
//         (error) => {
//           console.error('Error fetching location:', error);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   // Function to fetch human-readable location name (using OpenStreetMap or Google API)
//   const fetchLocationName = (lat, lon) => {
//     const nominatimURL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
//     fetch(nominatimURL)
//       .then((response) => response.json())
//       .then((data) => {
//         const address = data.display_name;
//         setLocationName(address);
//         setVisitedPlaces((prevPlaces) => [
//           ...prevPlaces,
//           { location: address, timeSpent: timer }
//         ]);
//       })
//       .catch((error) => console.error('Error fetching location name:', error));
//   };

//   useEffect(() => {
//     getCurrentLocation(); // Automatically fetch location when component mounts
//   }, []);

//   const handleEndVisit = () => {
//     stopTimer(); // Stop the timer when the visit ends
//     console.log(`Visit ended at ${locationName}. Time spent: ${timer} seconds`);
//     // You can store this data in a backend
//   };

//   return (
//     <div>
//       <h1>Site Visit Tracker</h1>
//       <p>Location: {locationName}</p>
//       <p>Latitude: {latitude}</p>
//       <p>Longitude: {longitude}</p>
//       <p>Time Spent: {timer} seconds</p>
//       <button onClick={handleEndVisit}>End Visit</button>

//       {/* <h2>Visited Places:</h2>
//       <ul>
//         {visitedPlaces.map((place, index) => (
//           <li key={index}>
//             {place.location} - Time Spent: {place.timeSpent} seconds
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );
// };

// export default SiteVisit;
import React, { useState, useEffect } from "react"

const SiteVisit = () => {
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [locationName, setLocationName] = useState("")
  const [error, setError] = useState("")

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      // Geolocation function with high accuracy enabled
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // const lat = position.coords.latitude
          // const lon = position.coords.longitude
          const lat = 10.062760; // Manually set latitude for more precision
          const lon = 76.318021
         
          setLatitude(lat)
          setLongitude(lon)
          console.log(`Latitude: ${lat}, Longitude: ${lon}`)
          fetchLocationName(lat, lon) // Reverse geocoding to get human-readable address
        },
        (error) => {
          console.error("Error fetching location:", error)
          if (error.code === error.PERMISSION_DENIED) {
            setError("Location access denied by user")
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setError("Position unavailable")
          } else if (error.code === error.TIMEOUT) {
            setError("Request timed out")
          } else {
            setError("Unknown error occurred")
          }
        },
        {
          enableHighAccuracy: true, // Use high-accuracy mode
          timeout: 10000, // Time out after 5 seconds
          maximumAge: 0 // Don’t use cached location
        }
      )
    } else {
      setError("Geolocation is not supported by this browser")
    }
  }

  // Function to reverse geocode the latitude and longitude to an address
  const fetchLocationName = (lat, lon) => {
    const nominatimURL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`

    fetch(nominatimURL)
      .then((response) => response.json())
      .then((data) => {
        setLocationName(data.display_name || "Location not found")
      })
      .catch((error) => {
        setError("Error fetching location name")
      })
  }

  useEffect(() => {
    getCurrentLocation() // Automatically get location when component mounts
  }, [])

  return (
    <div>
      <h1>Your Current Location</h1>
      {error && <p>Error: {error}</p>}
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Location: {locationName}</p>
    </div>
  )
}

export default SiteVisit
