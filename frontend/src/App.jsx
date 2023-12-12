/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { push as Menu } from "react-burger-menu";
import { FaArrowRight } from "react-icons/fa";
import ReactECharts from "echarts-for-react";

import "./App.css";

const App = () => {
  // const [url, setUrl] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [scrapedData, setScrapedData] = useState({});

  // const apiUrl = !import.meta.env.DEV
  //   ? import.meta.env.VITE_PROD_API_URL
  //   : import.meta.env.VITE_DEV_API_URL;
  // console.log(apiUrl);
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (url !== "" && url.includes("amazon")) {
  //     setIsLoading(true);

  //     const encodedUrl = encodeURIComponent(url);

  //     fetch(`${apiUrl}/api/data?url=${encodedUrl}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data[0]);
  //         setScrapedData(data[0]);
  //         setIsLoading(false);
  //         console.log("test", scrapedData);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //         setIsLoading(false);
  //       });
  //   }
  // };

  const [isOpen, setIsOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const closeMenu = () => setIsOpen(false);

  const chartOption = {
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
          shadowBlur: 200,
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

  return (
    <div>
      <Menu
        isOpen={isOpen}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        noOverlay
        onStateChange={({ isOpen }) => (isOpen ? null : closeMenu())}
        styles={styles}
        customBurgerIcon={
          <div className="menu-icon">
            <FaArrowRight size={24} />
          </div>
        }
      >
        <button onClick={() => setShowChart(true)}>Show Chart</button>
      </Menu>
      <div id="page-wrap">
        <div className="chart-container">
          {showChart && domLoaded && (
            <ReactECharts
              option={chartOption}
              style={{ height: "300px", width: "300px" }}
            />
          )}
        </div>
      </div>
    </div>
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

  bmBurgerBars: {
    background: "#373a47",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenu: {
    background: "#373a47",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0)",
  },
};

export default App;
