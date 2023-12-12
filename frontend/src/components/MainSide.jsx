import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";

function MainSide({ showChart, domLoaded, chartOption }) {
  return (
    <div id="page-wrap">
      <div className="chart-container">
        <SearchBar />
        {showChart && domLoaded && (
          <ReactECharts
            option={chartOption}
            style={{ height: "400px", width: "400px" }}
            theme="dark"
          />
        )}
      </div>
    </div>
  );
}

MainSide.propTypes = {
  domLoaded: PropTypes.bool.isRequired,
  chartOption: PropTypes.object.isRequired,
  showChart: PropTypes.bool.isRequired,
};

export default MainSide;
