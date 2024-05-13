/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import MainSide from "./components/MainSide";
import "./App.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChart, setShowChart] = useState([true, true, false, false]);
  const [starColors, setStarColors] = useState({
    star1: { color: "#3b82f6", show: false },
    star2: { color: "#a855f7", show: false },
    star3: { color: "#f87171", show: false },
    star4: { color: "#facc15", show: false },
    star5: { color: "#22c55e", show: false },
  });
  const [domLoaded, setDomLoaded] = useState(false);
  const [scrapedData, setScrapedData] = useState({});

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
      />

      <MainSide
        showChart={showChart}
        domLoaded={domLoaded}
        scrapedData={scrapedData}
        setScrapedData={setScrapedData}
        starColors={starColors}
      />
    </div>
  );
};

export default App;
