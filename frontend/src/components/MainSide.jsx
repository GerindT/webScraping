import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import WelcomeSection from "./WelcomeSection";
import RecommendItems from "./RecommendItems";

function MainSide({
  showChart,
  domLoaded,
  scrapedData,
  setScrapedData,
  starColors,
}) {
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
        color: starColors.star1.color,
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
        color: starColors.star2.color,
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
        color: starColors.star3.color,
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
        color: starColors.star4.color,
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
        color: starColors.star5.color,
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

  // Assume you have the descriptive analysis data in a variable named 'descriptiveAnalysis'
  const descriptiveAnalysis = {
    2020: { mean: 0.6, median: 0, standardDeviation: 0.8, range: 2 },
    2021: { mean: 1.6, median: 1, standardDeviation: 0.8, range: 2 },
    2022: { mean: 1.4, median: 1, standardDeviation: 1.5, range: 4 },
    2023: { mean: 6.4, median: 7, standardDeviation: 2.1, range: 5 },
  };

  // Extract years, mean, median, and standard deviation for the scatter chart
  const scatter = Object.entries(descriptiveAnalysis).map(([year, stats]) => ({
    name: year,
    value: [
      parseInt(year),
      stats.mean,
      stats.median,
      stats.standardDeviation,
      stats.range,
    ],
  }));
  const option2 = {
    xAxis: {
      type: "category",
      name: "Year",
      axisLabel: {
        interval: 1, // Show every label
      },
    },
    yAxis: {
      type: "value",
      name: "Metrics",
    },
    title: {
      text:
        Object.keys(scrapedData).length != 0
          ? "Descriptive Analysis"
          : "Sample Data ",
    },
    backgroundColor: "transparent", // Set the background color here
    pixelRatio: 2,
    series: [
      {
        data: scatter,
        type: "scatter",
        symbolSize: 20,
        encode: {
          x: 0,
          y: 1,
          tooltip: [1, 2, 3, 4],
        },
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const data = params.value;
        return `
          Year: ${data[0]}<br>
          Average Reviews: ${data[1]}<br>
          Middle Value: ${data[2]}<br>
          Variability: ${data[3]}<br>
          Range: ${data[4]}<br>

        `;
      },
    },
  };

  const sampleDataset = [
    {
      url: "Product A",
      reviewsByYear: {
        2022: {
          five_star: 10,
          four_star: 8,
          three_star: 5,
          two_star: 3,
          one_star: 1,
        },
        2023: {
          five_star: 15,
          four_star: 12,
          three_star: 8,
          two_star: 5,
          one_star: 3,
        },
      },
      descriptiveAnalysis: {
        2022: {
          mean: 5.4,
          median: 5,
          standardDeviation: 2.2,
          range: 9,
        },
        2023: {
          mean: 8.6,
          median: 8,
          standardDeviation: 4.0,
          range: 12,
        },
      },
      totalreviews: [],
    },
    // Add more products if needed
  ];

  // For the correlation chart
  const starRatings = [
    "five_star",
    "four_star",
    "three_star",
    "two_star",
    "one_star",
  ];
  const correlationData = [
    {
      name: "2020",
      data: [
        [1, 0.5, -0.2],
        [0.5, 1, -0.7],
        [-0.2, -0.7, 1],
      ],
    },
    {
      name: "2021",
      data: [
        [0.8, 0.3, 0.1],
        [0.3, 0.9, -0.5],
        [0.1, -0.5, 1],
      ],
    },
    // ... other years ...
  ];

  const mergedData = correlationData.reduce((result, yearData) => {
    // Extract data from the current year
    const currentData = yearData.data;

    // Check if result already has data
    if (result.length === 0) {
      // If not, initialize result with the current data
      result = currentData.map((row) => [...row]);
    } else {
      // If yes, merge the current data with result
      currentData.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          result[rowIndex].push(value);
        });
      });
    }

    return result;
  }, []);

  console.log(correlationData);

  const option = {
    backgroundColor: "transparent", // Set the background color here
    pixelRatio: 2,
    tooltip: {
      position: "top",
      formatter: (params) => {
        return `${params.data[2]} star correlation with ${params.data[3]} star: ${params.data[0]}`;
      },
    },
    visualMap: {
      show: false,
      min: -1,
      max: 1,
      calculable: true,
      orient: "horizontal",
      left: "center",
      top: "top",
      inRange: {
        color: ["#d94e5d", "#eac736", "#50a3ba"],
      },
    },
    grid: {
      height: "50%",
      y: "10%",
    },
    xAxis: {
      type: "category",
      data: ["five_star", "four_star", "three_star", "two_star", "one_star"],
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: ["2020", "2021", "2022"], // Add more years as needed
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "Correlation",
        type: "heatmap",
        data: mergedData,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const optionPie = {
    backgroundColor: "transparent", // Set the background color here
    pixelRatio: 2,
    title: {
      text:
        Object.keys(scrapedData).length != 0
          ? "User Sentiment "
          : "Sample user sentiment ",
    },
    tooltip: {
      trigger: "item",
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: "Save As Image",
          name: "user_sentiment_chart",
          pixelRatio: 2,
        },
      },
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name:
          Object.keys(scrapedData).length != 0
            ? `Total Reviews : ${Object.keys(scrapedData.sentiment).reduce(
                (a, b) => a + scrapedData.sentiment[b],
                0
              )}`
            : "Total Reviews : 2000",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value:
              Object.keys(scrapedData).length != 0
                ? scrapedData.sentiment.negative
                : 1048,
            name: "Negative",
            itemStyle: { color: "#f87171" }, // Specify color for "Not Satisfied"
          },
          {
            value:
              Object.keys(scrapedData).length != 0
                ? scrapedData.sentiment.neutral
                : 741,
            name: "Neutral",
            itemStyle: { color: "#3b82f6" }, // Specify color for "Neutral"
          },
          {
            value:
              Object.keys(scrapedData).length != 0
                ? scrapedData.sentiment.positive
                : 580,
            name: "Satisfied",
            itemStyle: { color: "#facc15" }, // Specify color for "Satisfied"
          },
          {
            value:
              Object.keys(scrapedData).length != 0
                ? scrapedData.sentiment.veryPositive
                : 484,
            name: "Perfect",
            itemStyle: { color: "#22c55e" }, // Specify color for "Perfect"
          },
        ],
      },
    ],
  };

  return (
    <div id="page-wrap">
      <div className="chart-container">
        <WelcomeSection />
        <SearchBar scrapedData={scrapedData} setScrapedData={setScrapedData} />
        {showChart && domLoaded ? (
          <>
            {showChart[0] && (
              <div
                style={{
                  maxHeight: "500px",
                  maxWidth: "800px",
                  display: "flex",
                }}
              >
                <ReactECharts
                  option={chartOption}
                  style={{ height: "50vh", width: "50vw" }}
                  theme="dark"
                />
              </div>
            )}
            {showChart[1] && (
              <div
                style={{
                  maxHeight: "500px",
                  maxWidth: "800px",
                  display: "flex",
                }}
              >
                <ReactECharts
                  option={optionPie}
                  style={{ height: "50vh", width: "50vw" }}
                  theme="dark"
                />
              </div>
            )}
            {showChart[2] && (
              <div
                style={{
                  maxHeight: "500px",
                  maxWidth: "800px",
                  display: "flex",
                }}
              >
                <ReactECharts
                  option={option2}
                  style={{ height: "50vh", width: "50vw" }}
                  theme="dark"
                />
              </div>
            )}
            {showChart[3] && (
              <div
                style={{
                  maxHeight: "500px",
                  maxWidth: "800px",
                  display: "flex",
                }}
              >
                <ReactECharts
                  option={option}
                  style={{ height: "50vh", width: "50vw" }}
                  theme="dark"
                />
              </div>
            )}
          </>
        ) : null}
        {Object.keys(scrapedData).length != 0 ? (
          <div className="flex flex-col gap-2 mt-2 md:flex-row">
            <RecommendItems data={scrapedData} />
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
  starColors: PropTypes.object.isRequired,
};

export default MainSide;
