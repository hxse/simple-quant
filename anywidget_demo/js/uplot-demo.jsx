import React from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { tooltipPlugin } from "./tooltipPlugin";
import { seriesPointsPlugin } from "./pointPlugin";

import { useState, useEffect, useMemo, useReducer, useRef } from "react";

let colorArray = ["", "red", "orange", "green", "cyan", "blue", "purple", "gray"];

const matchSyncKeys = (own, ext) => own == ext;
const cursorOpts = {
  lock: true,
  focus: {
    prox: 16,
  },
  sync: {
    key: uPlot.sync("moo"),
    setSeries: true,
    match: [matchSyncKeys, matchSyncKeys],
  },
};
let opts = {
  width: 800,
  height: 400,
  title: "Area Fill",
  cursor: cursorOpts,
  scales: {
    x: {
      time: true,
      distr: 2,
    },
  },
  series: [
    {
      stroke: "red",
    },
  ],
};

function Test({ value, ohlcvData, optObj }) {
  return (
    <UplotReact
      options={optObj}
      data={ohlcvData}
      // target={target}
      onCreate={(chart) => {
        document.querySelector(".u-under").style.background = "white";
        console.log("create " + value);
      }}
      onDelete={(chart) => {}}
    />
  );
}

function Test2({ value, ohlcvData, optObj }) {
  return Test({ value, ohlcvData, optObj });
}

export const Chart = ({ value, ohlcvData, optObj, ohlcvDataList, ohlcvDataLabel, GCData, DCData, GCDCList }) => {
  optObj = {
    ...optObj,
    plugins: [
      tooltipPlugin({ value, ohlcvData, optObj, ohlcvDataList, ohlcvDataLabel, GCData, DCData, GCDCList }),
      seriesPointsPlugin({ value, ohlcvData, optObj, ohlcvDataList, ohlcvDataLabel, GCData, DCData, GCDCList }),
    ],
  };

  opts.series = ohlcvDataList.map((i, idx) => ({
    stroke: idx >= colorArray.length ? colorArray.at(-1) : colorArray[idx],
  }));
  optObj = { ...opts, ...optObj };

  if (String(optObj.width).endsWith("%")) {
    optObj.width = window.screen.width * (parseInt(optObj.width) / 100);
  }
  if (String(optObj.height).endsWith("%")) {
    optObj.height = window.screen.height * (parseInt(optObj.height) / 100);
  }

  return (
    <div>
      {/* {parseInt(value) % 2 == 0 ?
                <Test value={value} optObj={optObj} ohlcvData={ohlcvData}></Test> : <Test2 value={value} optObj={optObj} ohlcvData={ohlcvData}></Test2>
            } */}
      <Test value={value} optObj={optObj} ohlcvData={ohlcvDataList.map((i) => ohlcvData[i])}></Test>
    </div>
  );
};
