import PropTypes from "prop-types";

export const ServiceCard = ({
  borderColor,
  textColor,
  title,
  children,
  bgColor,
}) => (
  <div className="w-full mb-10 sm:mb-0 sm:w-1/2 cursor-pointer  transition duration-100 ease-in transform  hover:scale-105 ">
    <div className="relative h-full ml-0 mr-0 sm:mr-10">
      <span
        className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 ${bgColor} rounded-lg`}
      ></span>
      <div
        className={`relative h-full p-5 bg-[#2b2a33] border-2 ${borderColor} rounded-lg`}
      >
        <div className="flex items-center -mt-1">
          <h3 className="my-2 ml-3 text-lg font-bold text-white-800">
            {title}
          </h3>
        </div>
        <p className={`mt-3 mb-1 text-xs font-medium ${textColor} uppercase`}>
          ------------
        </p>
        <p className="mb-2 text-white-600">{children}</p>
      </div>
    </div>
  </div>
);

ServiceCard.propTypes = {
  borderColor: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
