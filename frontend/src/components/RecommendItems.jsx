import { Card, Rating } from "flowbite-react";

import PropTypes from "prop-types";

function RecommendItems({ data }) {
  return (
    <>
      {data != null ? (
        <>
          {data.relatedItems.map((item) => (
            <div key={item.name}>
              <Card
                className="max-w-sm bg-[#2b2a33] border border-[3px] border-gray-600 shadow-lg rounded-lg overflow-hidden cursor-pointer  transition duration-100 ease-in transform  hover:scale-105"
                imgSrc={item.img}
              >
                <a href="#">
                  <h5 className="text-xl font-semibold tracking-tight text-white">
                    {item.name}
                  </h5>
                </a>
                <div className="mb-5 mt-2.5 flex items-center">
                  <Rating>
                    {[...Array(5)].map((_, index) => (
                      <Rating.Star
                        key={index}
                        filled={index < Math.round(item.rating.split(" ")[0])}
                      />
                    ))}
                  </Rating>
                  <span className="ml-3 mr-2 rounded  px-2.5 py-0.5 text-xs font-semibold  bg-blue-200 text-blue-800">
                    {item.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">
                    {"$" + item.price}
                  </span>
                  <a
                    href={item.url}
                    className="rounded-lg  px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                  >
                    Take me there
                  </a>
                </div>
              </Card>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </>
  );
}

RecommendItems.propTypes = {
  data: PropTypes.object,
};

export default RecommendItems;
