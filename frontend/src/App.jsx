/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { motion } from "framer-motion";

import Skeleton from "@mui/material/Skeleton";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState({});

  const apiUrl = !import.meta.env.DEV
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;
  console.log(apiUrl);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (url !== "" && url.includes("amazon")) {
      setIsLoading(true);

      const encodedUrl = encodeURIComponent(url);

      fetch(`${apiUrl}/api/data?url=${encodedUrl}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data[0]);
          setScrapedData(data[0]);
          setIsLoading(false);
          console.log("test", scrapedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    }
  };

  console.log("test", scrapedData);

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

        {scrapedData.url != undefined && (
          <>
            <p style={{ fontSize: "20px", textAlign: "center" }}>
              Provided url: <br />
              <span
                style={{
                  maxHeight: "67px",
                  maxWidth: "800px",
                  fontSize: "10px",
                }}
              >
                {scrapedData.url || "Nothing"}
              </span>
            </p>
            <p>
              Total Reviews
              {scrapedData.totalreviews ? scrapedData.totalreviews.length : 0}
            </p>
            <p>
              5 Star Rating
              {scrapedData.five_star ? scrapedData.five_star.length : 0}
            </p>
            <p>
              4 Star Rating
              {scrapedData.four_star ? scrapedData.four_star.length : 0}
            </p>
            <p>
              3 Star Rating
              {scrapedData.three_star ? scrapedData.three_star.length : 0}
            </p>
            <p>
              2 Star Rating
              {scrapedData.two_star ? scrapedData.two_star.length : 0}
            </p>
            <p>
              1 Star Rating
              {scrapedData.one_star ? scrapedData.one_star.length : 0}
            </p>
          </>
        )}
      </motion.div>
    </>
  );
};

export default App;
