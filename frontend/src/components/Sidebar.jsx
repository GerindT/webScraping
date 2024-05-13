import { useState } from "react";
import PropTypes from "prop-types";
import { push as Menu } from "react-burger-menu";
import { FaArrowRight } from "react-icons/fa";
import { HexColorPicker } from "react-colorful";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen, closeMenu, showChart, setShowChart }) => {
  const [starColors, setStarColors] = useState({
    star1: { color: "#4287f5", show: false },
    star2: { color: "#4287f5", show: false },
    star3: { color: "#4287f5", show: false },
    star4: { color: "#4287f5", show: false },
    star5: { color: "#4287f5", show: false },
  });

  const toggleChart = (index) => {
    setShowChart((prevState) => {
      const newState = [...prevState]; // Create a copy of the current state array
      newState[index] = !newState[index]; // Toggle the value at the first index
      return newState; // Return the updated state
    });
  };

  const handleShow = (star) => {
    setStarColors((prevState) => ({
      ...prevState,
      [star]: {
        ...prevState[star],
        show: !prevState[star].show,
      },
    }));
  };

  const handleColorChange = (star, color) => {
    setStarColors((prevState) => ({
      ...prevState,
      [star]: {
        ...prevState[star],
        color: color,
      },
    }));
  };

  return (
    <Menu
      isOpen={isOpen}
      pageWrapId={"page-wrap"}
      noOverlay
      disableAutoFocus
      styles={styles}
      onStateChange={({ isOpen }) => (isOpen ? null : closeMenu())}
      customBurgerIcon={
        <div className="menu-icon">
          <FaArrowRight size={24} />
        </div>
      }
    >
      <h2>Color choice for Reviews</h2>

      {Object.entries(starColors).map(([star, { color, show }], index) => (
        <div key={index}>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(index + 1)].map((_, starIndex) => (
                  <FaStar key={starIndex} />
                ))}
              </div>
              <div
                className="w-6 h-5 rounded-lg"
                style={{ backgroundColor: color }}
              ></div>
            </div>
            <div>
              <MdKeyboardDoubleArrowRight
                size={25}
                onClick={() => handleShow(star)}
              />
            </div>
            <div className="test">
              {show && (
                <HexColorPicker
                  color={color}
                  onChange={(event) => handleColorChange(star, event)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <h2>Toggle Charts</h2>
      {Object.keys(showChart).map((chartIndex) => (
        <label key={chartIndex}>
          <input
            type="checkbox"
            checked={showChart[chartIndex]}
            onChange={() => toggleChart(chartIndex)}
          />
          Toggle Chart {parseInt(chartIndex) + 1}
        </label>
      ))}
    </Menu>
  );
};

const styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "40px",
    height: "40px",
    left: "10px",
    top: "10px",
  },

  bmCrossButton: {
    height: "40px",
    width: "40px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenu: {
    background: "#3d3d3d",
    padding: "1.5em 1.5em 0",
    fontSize: "1.15em",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
  },
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  showChart: PropTypes.bool.isRequired,
  setShowChart: PropTypes.func.isRequired,
};

export default Sidebar;
