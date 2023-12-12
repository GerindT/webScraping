import { useState } from "react";
import { motion } from "framer-motion";

// The SearchBar component
function SearchBar() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // Add this line

  const apiUrl = !import.meta.env.DEV
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;
  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the URL is valid
    if (url === "" || !url.includes("amazon")) {
      setErrorMessage("Invalid URL. Please enter a valid Amazon product URL.");
      return;
    }

    setIsLoading(true);
    const encodedUrl = encodeURIComponent(url);
    try {
      // Fetch data from the API
      const response = await fetch(`${apiUrl}/api/data?url=${encodedUrl}`);
      const data = await response.json();
      setScrapedData(data[0]);
      setIsLoading(false);
      setErrorMessage("");
    } catch (error) {
      // Handle errors
      console.error("Error fetching data:", error);
      setIsLoading(false);
      setErrorMessage(
        "An error occurred while fetching data. Please try again."
      );
    }
  };
  return (
    <motion.div className="mt-[55px] ">
      <h1 className="pb-[10px] text-center text-[22px]">
        Insert your product&apos;s url
      </h1>
      <form onSubmit={handleSubmit} className=" flex flex-col ">
        <label>
          <input
            className="w-[100%] focus:outline-none focus:ring focus:ring-gray-500 "
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        {errorMessage && (
          <p className="text-red-600 mt-[10px]">{errorMessage}</p>
        )}
        {isLoading && (
          <p className="text-grey-600 mt-[10px]">
            Your data is being fetched. Please wait!
          </p>
        )}
        <input
          type="submit"
          className="mt-[10px] bg-gray-500  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform  hover:scale-105 cursor-pointer"
        />
      </form>
      {isLoading && (
        <>
          <div className="flex justify-center items-center mt-[20px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        </>
      )}

      {scrapedData.url != undefined && (
        <div className="mt-[10px]">
          <p>
            Total Reviews :{" "}
            {scrapedData.totalreviews ? scrapedData.totalreviews.length : 0}
          </p>
          <p>
            5 Star Rating :{" "}
            {scrapedData.five_star ? scrapedData.five_star.length : 0}
          </p>
          <p>
            4 Star Rating :{" "}
            {scrapedData.four_star ? scrapedData.four_star.length : 0}
          </p>
          <p>
            3 Star Rating :{" "}
            {scrapedData.three_star ? scrapedData.three_star.length : 0}
          </p>
          <p>
            2 Star Rating :{" "}
            {scrapedData.two_star ? scrapedData.two_star.length : 0}
          </p>
          <p>
            1 Star Rating :{" "}
            {scrapedData.one_star ? scrapedData.one_star.length : 0}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default SearchBar;
