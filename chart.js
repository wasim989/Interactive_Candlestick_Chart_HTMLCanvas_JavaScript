//binance api response example
// [
//   [
//     1499040000000,      // Open time
//     "0.01634790",       // Open
//     "0.80000000",       // High
//     "0.01575800",       // Low
//     "0.01577100",       // Close
//     "148976.11427815",  // Volume
//     1499644799999,      // Close time
//     "2434.19055334",    // Quote asset volume
//     308,                // Number of trades
//     "1756.87402397",    // Taker buy base asset volume
//     "28.46694368",      // Taker buy quote asset volume
//     "17928899.62484339" // Ignore.
//   ]
// ]

//[0] is open value, 1 is close
let candleData = [
  [4, 3, 3, 4],
  [4, 5, 4, 5],
  [4, 3, 3, 4],
  [5, 4, 4, 5],
  [3, 4, 3, 4],
  [4, 5, 4, 5],
  [3, 4, 3, 4],
  [4.4, 4.5, 4, 5],
  [3.9, 3.7, 3, 4],
  [4, 5, 4, 5],
  [4.2, 4.7, 4, 5],
  [5.2, 5.5, 5, 6],
  [3.2, 3.5, 3, 4],
  [4.2, 4.7, 4, 5],
  [5.2, 5.5, 5, 6],
  [3.2, 3.5, 3, 4],
  [4.2, 4.7, 4, 5],
  [5.2, 5.5, 5, 6],
  [3.2, 3.5, 3, 4],
  [4.2, 4.7, 4, 5],
  [5.2, 5.5, 5, 6],
  [3.2, 3.5, 3, 4]
];
let data = [
  1,
  2,
  3,
  4,
  5,
  6,
  6,
  7,
  4,
  3,
  5,
  5,
  5,
  5,
  9,
  9,
  9,
  9,
  4,
  5,
  5,
  5,
  5,
  5,
  4,
  4,
  4
];

let canvasWidth;
let canvasHeight;
let rightMarginPercentage = 10;
let bottomMarginPercentage = 10;

let noOfDataPoints;

let candleMaxValue;
let candleMinValue;
let candleYIncrement;
let candleXIncrement;

let rightMarginWidth;
let bottomMarginHeight;
let viewportWidth;
let ViewportHeight;

let startPosition; //location from which data is printed to canvas

let zoomLevel = 0;
let scrollLevel = 0; //in pixels. positive number = move chart to the right
let currentScroll = 0; //amount of scroll distance for current mouse drag
let tempScroll = 0; //temporarily stores scroll distance (walk) to update global scroll level for chart

let canvas;
let ctx;

(function initCanvas() {
  canvasHeight = document.getElementById("my-canvas").offsetHeight;
  canvasWidth = document.getElementById("my-canvas").offsetWidth;

  canvas = document.getElementById("my-canvas");
  ctx = canvas.getContext("2d");

  canvas.onmousedown = scrollHandler;

  fetchData();

  canvasCalcs();
  //redrawCalcs();

  drawCanvas();
  //redrawChart();
})();

function scrollHandler(e) {
  e = e || window.event;
  e.preventDefault();
  console.log("scroll initiated");
  ScrollStartPos = e.clientX;
  tempScroll = scrollLevel;
  canvas.onmousemove = dragHandler;
  document.onmouseup = cancelScroll;
}

function dragHandler(e) {
  e.preventDefault();

  const x = e.clientX;
  currentScroll = tempScroll + (x - ScrollStartPos);
  scrollLevel = currentScroll;
  redrawCanvas();
  console.log(currentScroll);
  currentScroll = 0;
  console.log(scrollLevel);
}

function cancelScroll(e) {
  e.preventDefault();
  scrollLevel += currentScroll;
  canvas.onmousemove = null;
  document.onmouseup = null;
}

function fetchData() {
  //initialise data array
}

function canvasCalcs() {
  calcMarginAndViewportSize();
  calcNoOfDataPoints();
  calcStartPosition();

  calcCandleValueRange();
  calcCandleXIncrement();
  calcCandleYIncrement();
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawChartBorder();
  drawCandleChart();
}

function redrawCanvas() {
  //calculations
  canvasCalcs();
  //draw functions
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawChartBorder();
  drawCandleChart();
}

function calcMarginAndViewportSize() {
  rightMarginWidth = (canvasWidth / 100) * rightMarginPercentage;
  bottomMarginHeight = (canvasHeight / 100) * bottomMarginPercentage;

  viewportWidth = canvasWidth - rightMarginWidth;
  viewportHeight = canvasHeight - bottomMarginHeight;
}

function calcNoOfDataPoints() {
  //calculate using zoom level and, width
  noOfDataPoints = 20;
}

function calcCandleValueRange() {
  minArr = candleData.map(function(row) {
    return Math.min.apply(Math, row);
  });

  maxArr = candleData.map(function(row) {
    return Math.max.apply(Math, row);
  });

  candleMinValue = Math.min.apply(Math, minArr);
  candleMaxValue = Math.max.apply(Math, maxArr);
}

function calcCandleYIncrement() {
  candleYIncrement = Math.floor(
    viewportHeight / (candleMaxValue - candleMinValue)
  );
}

function calcCandleXIncrement() {
  candleXIncrement = Math.floor(viewportWidth / noOfDataPoints);
}

// canvas position at which to strat printing chart data e.g. -10 means 10 bar
// widths to the left of the canvas start (essentially draws off canvas)
function calcStartPosition() {
  if (data.length <= noOfDataPoints) {
    startPosition = 0;
  } else {
    startPosition = noOfDataPoints - data.length;
    //console.log(noOfDataPoints);
  }

  //factor in scroll and zoom
}

function getCandleLineX(dataXPosition) {
  let startX = dataXPosition * candleXIncrement + scrollLevel;
  return Math.floor(startX + candleXIncrement * 0.5);
}

function getCandleLineStartY(candleData) {
  return (
    viewportHeight -
    (candleData * candleYIncrement - candleMinValue * candleYIncrement)
  );
}

function getCandleLineEndY(data) {
  return (
    viewportHeight -
    (data * candleYIncrement - candleMinValue * candleYIncrement)
  );
}

function getCandleBarStartX(dataXPosition) {
  return dataXPosition * candleXIncrement + scrollLevel; //delete soon
}

function getCandleBarStartY(dataA, dataB) {
  return Math.floor(
    viewportHeight -
      (Math.max(dataA, dataB) * candleYIncrement -
        candleMinValue * candleYIncrement)
  );
}

function getCandelBarHeight(dataA, dataB) {
  return Math.floor(
    (Math.max(dataA, dataB) - Math.min(dataA, dataB)) * candleYIncrement
  );
}

function getCandleFillColor(dataA, dataB) {
  if (dataA < dataB) {
    return "green";
  } else {
    return "red";
  }
}

function drawCandleChart() {
  drawAxis();

  for (i = startPosition; i < candleData.length + startPosition; i++) {
    var startIndex = i - startPosition;
    console.log(
      startIndex +
        " " +
        startPosition +
        " " +
        i +
        " " +
        (candleData.length + startPosition)
    );
    let lineX = getCandleLineX(i);
    let lineStartY = getCandleLineStartY(candleData[startIndex][2]);
    let lineEndY = getCandleLineEndY(candleData[startIndex][3]);

    drawLine(lineX, lineStartY, lineX, lineEndY);

    if (candleData[startIndex][0] != candleData[startIndex][1]) {
      let barStartY = getCandleBarStartY(
        candleData[startIndex][0],
        candleData[startIndex][1]
      );
      let barStartX = getCandleBarStartX(i);
      let barHeight = getCandelBarHeight(
        candleData[startIndex][0],
        candleData[startIndex][1]
      );

      let fillColor = getCandleFillColor(
        candleData[startIndex][0],
        candleData[startIndex][1]
      );

      drawRect(barStartX, barStartY, candleXIncrement, barHeight, fillColor);
    }
  }
}

function drawChartBorder() {
  drawLine(0, 0, 0, canvasHeight);
  drawLine(0, canvasHeight, canvasWidth, canvasHeight);
  drawLine(0, 0, canvasWidth, 0);
  drawLine(canvasWidth, canvasHeight, canvasWidth, 0);
}

function drawAxis() {
  drawLine(viewportWidth, viewportHeight, viewportWidth, 0);
  drawLine(0, viewportHeight, viewportHeight, viewportWidth);
}

function drawLine(xS, yS, xE, yE) {
  ctx.beginPath();
  ctx.moveTo(xS, yS);
  ctx.lineTo(xE, yE);
  ctx.stroke();
}

function drawRect(xS, yS, width, height, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(xS, yS, width, height);
  ctx.stroke();
}

//-- create gutters with axis
//10% of canvas size on right and on bottom
//axis at margin and box around entire chart

//-- implement mouse zoom

//-- implement side scrolling

//-- implement candelsticks

//-- additional indicators

//-- colours

//-- live data
