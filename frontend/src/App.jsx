/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { motion } from "framer-motion";

import Skeleton from "@mui/material/Skeleton";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (url !== "" && url.includes("amazon")) {
      setIsLoading(true);

      const encodedUrl = encodeURIComponent(url);

      fetch(`http://127.0.0.1:3000/api/data?url=${encodedUrl}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data[0]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <motion.div className="motion-container">
        <h1>Insert your product's url</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>
        {isLoading && (
          <>
            <Skeleton style={{ width: "20vw", marginTop: "20px" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            <Skeleton style={{ width: "20vw" }} />
            {/*  ... Skeleton components */}
          </>
        )}
      </motion.div>
    </>
  );
};

export default App;
