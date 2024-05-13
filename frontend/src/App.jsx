/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import MainSide from "./components/MainSide";
import "./App.css";
import { FaInfoCircle } from "react-icons/fa";
import { Modal } from "flowbite-react";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChart, setShowChart] = useState([true, true, false, false]);
  const [showExtra, setShowExtra] = useState([true]);
  const [starColors, setStarColors] = useState({
    star1: { color: "#3b82f6", show: false },
    star2: { color: "#a855f7", show: false },
    star3: { color: "#f87171", show: false },
    star4: { color: "#facc15", show: false },
    star5: { color: "#22c55e", show: false },
  });
  const [domLoaded, setDomLoaded] = useState(false);
  const [scrapedData, setScrapedData] = useState({});
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <div>
      <Sidebar
        isOpen={isOpen}
        closeMenu={closeMenu}
        showChart={showChart}
        setShowChart={setShowChart}
        setStarColors={setStarColors}
        starColors={starColors}
        extraInfo={showExtra}
        setShowExtra={setShowExtra}
      />

      <MainSide
        showChart={showChart}
        domLoaded={domLoaded}
        scrapedData={scrapedData}
        setScrapedData={setScrapedData}
        starColors={starColors}
        extraInfo={showExtra}
      />
      <div
        className="absolute transition duration-100 ease-in transform cursor-pointer top-5 right-5 hover:scale-105"
        onClick={() => setOpenModal(true)}
      >
        <FaInfoCircle size={24} />
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <h2 className="text-xl font-semibold">About this project</h2>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg leading-relaxed text-gray-500">
            This project is a web scraping application that scrapes reviews from
            a website and displays them in a visually appealing way. The reviews
            are analyzed and displayed in a chart to show the distribution of
            ratings. The user can also customize the colors of the stars in the
            chart.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
