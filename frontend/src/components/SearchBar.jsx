import { useState } from "react";
import { motion } from "framer-motion";
import { IoMdInformationCircleOutline } from "react-icons/io";

import PropTypes from "prop-types";

const bgColors = [
  "border-red-600",
  "border-blue-700",
  "border-yellow-400",
  "border-green-600",
  "border-cyan-600",
  "border-pink-600",
  "border-purple-600",
  "border-indigo-600",
  "border-gray-600",
];

// The SearchBar component
function SearchBar({ scrapedData, setScrapedData }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setErrorMessage("");
    const encodedUrl = encodeURIComponent(url);
    if (!isLoading) {
      try {
        // Fetch data from the API
        const response = await fetch(`${apiUrl}/api/data?url=${encodedUrl}`);
        const data = await response.json();
        console.log("data", data[0]);
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
    }
  };

  const reviewTypes = {
    totalreviews: "Total Reviews",
    one_star: "One Star Reviews",
    two_star: "Two Star Reviews",
    three_star: "Three Star Reviews",
    four_star: "Four Star Reviews",
    five_star: "Five Star Reviews",
  };

  return (
    <motion.div>
      <h1 className="pb-[10px] text-center text-[22px]">
        Insert your product&apos;s url
      </h1>
      <form onSubmit={handleSubmit} className=" flex flex-col ">
        <label>
          <input
            className={`w-[100%] focus:outline-none focus:ring focus:ring-gray-500 bg-[#2b2a33] rounded-xl `}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </label>
        {errorMessage && (
          <p className="flex  text-red-500 mt-[10px] text-[15px] text-sm font-medium">
            <IoMdInformationCircleOutline
              size={20}
              className="flex self-center mr-[5px]"
            />
            {errorMessage}
          </p>
        )}
        {isLoading && (
          <p className="flex text-grey-600 mt-[10px] text-[15px] text-sm font-medium">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            Your data is being fetched. Please wait!
          </p>
        )}
        <input
          type="submit"
          disabled={isLoading}
          className={`${
            isLoading ? "opacity-[0.2] cursor-progress " : ""
          } rounded-xl  mt-[10px] bg-gray-500  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform  hover:scale-105 cursor-pointer`}
        />
      </form>

      {scrapedData.url != undefined && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-6 lg:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-4">
            {Object.entries(reviewTypes).map(([key, name]) => (
              <div
                key={key}
                className="bg-[#2b2a33] overflow-hidden shadow sm:rounded-lg cursor-pointer  transition duration-100 ease-in transform  hover:scale-105"
              >
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm leading-5 font-medium text-gray-400 truncate">
                      {name}
                    </dt>
                    <dd className="mt-1 text-3xl leading-9 font-semibold text-white-600">
                      {scrapedData[key] ? scrapedData[key].length : 0}
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>
          <h2 className="mt-[1em] text-2xl leading-tight text-white-600 text-center">
            User Reception
          </h2>
          <div className="mt-[0.5em] flex gap-1 justify-between">
            <div>
              <p className="text-center cursor-pointer text-red-700">
                Negative
              </p>
              <div className="  text-gray-100 font-medium  px-2.5 py-0.5 rounded-full bg-red-600 cursor-pointer  transition duration-100 ease-in transform  hover:scale-105  ">
                {(
                  (scrapedData.sentiment.negative /
                    Object.keys(scrapedData.sentiment).reduce(
                      (a, b) => a + scrapedData.sentiment[b],
                      0
                    )) *
                  100
                ).toFixed(2) + "%"}
              </div>
            </div>
            <div>
              <p className="text-center cursor-pointer text-blue-600">
                Neutral
              </p>
              <div className=" text-gray-100  font-medium  px-2.5 py-0.5 rounded-full bg-blue-700 cursor-pointer  transition duration-100 ease-in transform  hover:scale-105 ">
                {(
                  (scrapedData.sentiment.neutral /
                    Object.keys(scrapedData.sentiment).reduce(
                      (a, b) => a + scrapedData.sentiment[b],
                      0
                    )) *
                  100
                ).toFixed(2) + "%"}
              </div>
            </div>
            <div>
              <p className="text-center cursor-pointer text-yellow-400">
                Satisfied
              </p>

              <div className=" text-gray-100  font-medium  px-2.5 py-0.5 rounded-full bg-yellow-400 cursor-pointer  transition duration-100 ease-in transform  hover:scale-105 ">
                {(
                  (scrapedData.sentiment.positive /
                    Object.keys(scrapedData.sentiment).reduce(
                      (a, b) => a + scrapedData.sentiment[b],
                      0
                    )) *
                  100
                ).toFixed(2) + "%"}
              </div>
            </div>
            <div>
              <p className="text-center text-green-600 cursor-pointer">
                Perfect
              </p>
              <div className=" text-gray-100  font-medium  px-2.5 py-0.5 rounded-full bg-green-600 cursor-pointer  transition duration-100 ease-in transform  hover:scale-105 ">
                {(
                  (scrapedData.sentiment.veryPositive /
                    Object.keys(scrapedData.sentiment).reduce(
                      (a, b) => a + scrapedData.sentiment[b],
                      0
                    )) *
                  100
                ).toFixed(2) + "%"}
              </div>
            </div>
          </div>

          <h2 className="mt-[1.5em] text-xl leading-tight text-white-600 text-center">
            Most Common Thoughts
          </h2>
          <div className="flex flex-wrap gap-2 mt-4 max-w-2xl">
            {scrapedData.keyword.map((name) => (
              <div
                key={name}
                className={`${
                  bgColors[Math.floor(Math.random() * bgColors.length)]
                } bg-[#2b2a33] border border-[3px]  overflow-hidden shadow sm:rounded-lg cursor-pointer  transition duration-100 ease-in transform  hover:scale-105`}
              >
                <div className="px-3 py-1 ">
                  <dl>
                    <dd className=" text-sm leading-1 font-semibold text-white-600">
                      {name}
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>
          <h2 className="mt-[1.5em] text-xl leading-tight text-white-600 text-center">
            Product Features
          </h2>
          <div className="flex flex-wrap gap-2 mt-4 max-w-2xl">
            {scrapedData.descriptionFeatures.map((name) => (
              <div
                key={name}
                className={`${
                  bgColors[Math.floor(Math.random() * bgColors.length)]
                } bg-[#2b2a33] border border-[3px]  overflow-hidden shadow sm:rounded-lg cursor-pointer  transition duration-100 ease-in transform  hover:scale-105`}
              >
                <div className="px-3 py-1 ">
                  <dl>
                    <dd className=" text-sm leading-1 font-semibold text-white-600">
                      {name}
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

SearchBar.propTypes = {
  scrapedData: PropTypes.object.isRequired,
  setScrapedData: PropTypes.func.isRequired,
};

export default SearchBar;
