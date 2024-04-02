import React from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { tooltipPlugin } from "./tooltipPlugin";
import { seriesPointsPlugin } from "./pointPlugin";
import { candlePlugin } from "./candlePlugin";
import { rangePlugin } from "./rangePlugin";

import { useState, useEffect, useMemo, useReducer, useRef } from "react";

let colorArray = ["red", "orange", "green", "cyan", "blue", "purple", "gray"];

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
    y: {},
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
        console.log("create " + value);
      }}
      onDelete={(chart) => {}}
    />
  );
}

function Test2({ value, ohlcvData, optObj }) {
  return Test({ value, ohlcvData, optObj });
}
function setSize(optObj) {
  if (String(optObj.width).endsWith("%")) {
    optObj.width = window.screen.width * (parseInt(optObj.width) / 100);
  }
  if (String(optObj.height).endsWith("%")) {
    optObj.height = window.screen.height * (parseInt(optObj.height) / 100);
  }
  return optObj;
}

export const Chart = ({
  value,
  ohlcData,
  taData,
  storeData,
  gcData,
  dcData,
  ohlcConfig,
  taConfig,
  btConfig,
  chartOpt,
  subOpt,
  storeOpt,
}) => {
  const _o = {
    value,
    ohlcData,
    taData,
    storeData,
    gcData,
    dcData,
    ohlcConfig,
    taConfig,
    btConfig,
    chartOpt,
    subOpt,
    storeOpt,
  };
  let createPlugin = (id) => [
    tooltipPlugin({ id, ..._o }),
    candlePlugin({ id, ..._o }),
    seriesPointsPlugin({ id, ..._o }),
    // rangePlugin({ id, ..._o }),
  ];

  let _chartOpt = {
    ...opts,
    ...chartOpt,
    series: [
      {},
      ...taConfig["ma"].map((i, idx) => ({
        stroke: idx >= colorArray.length ? colorArray.at(-1) : colorArray[idx],
      })),
      ...taConfig["bbands"].map((i, idx) => ({
        stroke: colorArray.at(-1),
        dash: [10, 10],
      })),
    ],
    plugins: [...createPlugin("ohlcChart")],
  };
  _chartOpt = setSize(_chartOpt);

  _chartOpt["scales"]["y"]["range"] = (u, dataMin, dataMax) => {
    let [iMin, iMax] = u.series[0].idxs;
    let maxHigh = Math.max(...ohlcData["high"].slice(iMin, iMax)) + 5;
    let minLow = Math.min(...ohlcData["low"].slice(iMin, iMax)) - 5;
    return [minLow, maxHigh];
  };
  let _chartData = [
    ohlcData["time"],
    ...taConfig["ma"].map((i) => taData[i]),
    ...taConfig["bbands"].map((i) => taData[i]),
  ];

  let _storeLable = ["time", "money_up", "money_cur_up", "money_down", "money_cur_down", "money"];
  let _storeOpt = {
    ...opts,
    ...storeOpt,
    series: _storeLable.map((i, idx) => ({
      stroke: idx >= colorArray.length ? colorArray.at(-1) : colorArray[idx],
    })),
    plugins: [...createPlugin("storeChart")],
  };
  _storeOpt = setSize(_storeOpt);
  let _storeData = [ohlcData[_storeLable[0]], ..._storeLable.slice(1).map((i) => storeData[i])];

  return (
    <div>
      <div>
        {chartOpt.show ? (
          <UplotReact
            options={_chartOpt}
            data={_chartData}
            // target={target}
            onCreate={(chart) => {
              console.log("create chartPlot " + value);
            }}
            onDelete={(chart) => {}}
          />
        ) : (
          <div></div>
        )}
      </div>
      {/* <div>
        {subOpt.show ? (
          <UplotReact
            options={optObj}
            data={ohlcvData}
            // target={target}
            onCreate={(chart) => {
              console.log("create " + value);
            }}
            onDelete={(chart) => {}}
          />
        ) : (
          <div></div>
        )}
      </div> */}
      <div>
        {storeOpt.show ? (
          <UplotReact
            options={_storeOpt}
            data={_storeData}
            // target={target}
            onCreate={(chart) => {
              console.log("create storePlot" + value);
            }}
            onDelete={(chart) => {}}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
