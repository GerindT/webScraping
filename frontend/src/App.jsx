/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import MainSide from "./components/MainSide";
import "./App.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="mainWrapper">
      <Sidebar
        isOpen={isOpen}
        closeMenu={closeMenu}
        showChart={showChart}
        setShowChart={setShowChart}
      />

      <MainSide
        showChart={showChart}
        domLoaded={domLoaded}
        chartOption={chartOption}
      />
    </div>
  );
};

const chartOption = {
  backgroundColor: "transparent",

  title: {
    text: "Customized Pie",
    left: "center",
    top: 20,
    textStyle: {
      color: "#ccc",
    },
  },
  tooltip: {
    trigger: "item",
  },
  visualMap: {
    show: false,
    min: 80,
    max: 600,
    inRange: {
      colorLightness: [0, 1],
    },
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "55%",
      center: ["50%", "50%"],
      data: [
        { value: 335, name: "Direct" },
        { value: 310, name: "Email" },
        { value: 274, name: "Union Ads" },
        { value: 235, name: "Video Ads" },
        { value: 400, name: "Search Engine" },
      ].sort(function (a, b) {
        return a.value - b.value;
      }),
      roseType: "radius",
      label: {
        color: "rgba(255, 255, 255, 0.3)",
      },
      labelLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
        smooth: 0.2,
        length: 10,
        length2: 20,
      },
      itemStyle: {
        color: "#c23531",
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: function () {
        return Math.random() * 200;
      },
    },
  ],
};

export default App;
