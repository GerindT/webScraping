import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import WelcomeSection from "./WelcomeSection";

function MainSide({ showChart, domLoaded, scrapedData, setScrapedData }) {
  const chartOption = {
    title: {
      text:
        Object.keys(scrapedData).length != 0
          ? "Reviews by Years"
          : "Sample Data ",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["One Star", "Two Star", "Three Star", "Four Star", "Five Star"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data:
        Object.keys(scrapedData).length != 0
          ? Object.keys(scrapedData.reviewsByYear)
          : ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    },
    yAxis: {
      type: "value",
    },
    backgroundColor: "transparent", // Set the background color here
    pixelRatio: 2,
    series: [
      {
        color: "#3b82f6",
        name: "One Star",
        type: "line",
        stack: "Total",
        data:
          Object.keys(scrapedData).length != 0
            ? Object.values(scrapedData.reviewsByYear).map(
                (yearData) => yearData.one_star
              )
            : [120, 132, 101, 134, 90, 230, 210],
      },
      {
        color: "#a855f7",
        name: "Two Star",
        type: "line",
        stack: "Total",
        data:
          Object.keys(scrapedData).length != 0
            ? Object.values(scrapedData.reviewsByYear).map(
                (yearData) => yearData.two_star
              )
            : [220, 182, 191, 234, 290, 330, 310],
      },
      {
        color: "#f87171",
        name: "Three Star",
        type: "line",
        stack: "Total",
        data:
          Object.keys(scrapedData).length != 0
            ? Object.values(scrapedData.reviewsByYear).map(
                (yearData) => yearData.three_star
              )
            : [150, 232, 201, 154, 190, 330, 410],
      },
      {
        color: "#facc15",
        name: "Four Star",
        type: "line",
        stack: "Total",
        data:
          Object.keys(scrapedData).length != 0
            ? Object.values(scrapedData.reviewsByYear).map(
                (yearData) => yearData.four_star
              )
            : [320, 332, 301, 334, 390, 330, 320],
      },
      {
        color: "#22c55e",
        name: "Five Star",
        type: "line",
        stack: "Total",
        data:
          Object.keys(scrapedData).length != 0
            ? Object.values(scrapedData.reviewsByYear).map(
                (yearData) => yearData.five_star
              )
            : [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };

  return (
    <div id="page-wrap">
      <div className="chart-container">
        <WelcomeSection />
        <SearchBar scrapedData={scrapedData} setScrapedData={setScrapedData} />
        {showChart && domLoaded ? (
          <div
            style={{ maxHeight: "500px", maxWidth: "800px", display: "flex" }}
          >
            <ReactECharts
              option={chartOption}
              style={{ height: "50vh", width: "50vw" }}
              theme="dark"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

MainSide.propTypes = {
  domLoaded: PropTypes.bool.isRequired,
  showChart: PropTypes.bool.isRequired,
  scrapedData: PropTypes.object.isRequired,
  setScrapedData: PropTypes.func.isRequired,
};

export default MainSide;
