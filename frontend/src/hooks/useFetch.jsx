// import { useEffect, useState } from "react";
// import { fetchDataFromApi } from "../api/fetchDataFromApi";

// const UseFetch = (url) => {
//   const [refresh, setRefresh] = useState(false);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!url) {
//       return;
//     }

//     const fetchData = async () => {
//       setLoading("loading...");
//       setData([]);
//       setError(null);

//       try {
//         const result = await fetchDataFromApi(url);
//         setData(result);
//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//         setError("Something went wrong!");
//       }
//     };

//     fetchData();
//   }, [url, refresh]);

//   const refreshHook = () => {
//     setRefresh(!refresh);
//   };

//   return { data, loading, error, refreshHook };
// };

// export default UseFetch;

import { useEffect, useState } from "react"
import { fetchDataFromApi } from "../api/fetchDataFromApi"

const UseFetch = (url) => {
  const [refresh, setRefresh] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      return
    }

    const fetchData = async () => {
      setLoading("loading...")
      setData(null)
      setError(null)

      try {
        const result = await fetchDataFromApi(url)
        if (result.data) {
          console.log("datain usefetfh", result.data)
          setData(result.data)
          setLoading(false)
        } else {
          setError("Expected data to be an array")
          console.error("Expected data to be an array", result)
        }
      } catch (err) {
        setLoading(false)
        setError(err.message || "Something went wrong!")
      }
    }

    fetchData()
  }, [url, refresh])

  const refreshHook = () => {
    setRefresh(!refresh)
  }

  return { data, loading, error, refreshHook }
}

export default UseFetch
