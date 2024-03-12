/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import MainSide from "./components/MainSide";
import "./App.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChart, setShowChart] = useState([true, true, true, true]);
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
      />

      <MainSide
        showChart={showChart}
        domLoaded={domLoaded}
        scrapedData={scrapedData}
        setScrapedData={setScrapedData}
      />
    </div>
  );
};

export default App;
