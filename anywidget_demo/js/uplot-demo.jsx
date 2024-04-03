import React from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { tooltipPlugin } from "./tooltipPlugin";
import { seriesPointsPlugin } from "./pointPlugin";
import { candlePlugin } from "./candlePlugin";
import { wheelZoomPlugin } from "./wheelZoomPlugin";

let chartColorArray = ["red", "orange", "green", "cyan", "blue", "purple", "gray"];
let subColorArray = ["orange", "green", "cyan", "blue", "purple", "gray"];
let storeColorArray = ["red", "orange", "green", "cyan", "blue", "purple", "gray"];

const matchSyncKeys = (own, ext) => own == ext;

const cursorOpts = {
  lock: false,
  focus: {
    prox: 16,
    alpha: 1,
  },
  sync: {
    key: uPlot.sync("moo"),
    setSeries: true,
    match: [matchSyncKeys, matchSyncKeys],
  },
};

let initOpts = {
  width: 800,
  height: 400,
  // title: "Area Fill",
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

function setSize(optObj) {
  if (String(optObj.width).endsWith("%")) {
    optObj.width = window.screen.width * (parseInt(optObj.width) / 100);
  }
  if (String(optObj.height).endsWith("%")) {
    optObj.height = window.screen.height * (parseInt(optObj.height) / 100);
  }
  return optObj;
}

function createPlugin(_opts, _id) {
  return [
    tooltipPlugin({ _id, ..._opts }),
    candlePlugin({ _id, ..._opts }),
    seriesPointsPlugin({ _id, ..._opts }),
    wheelZoomPlugin({ _id, ..._opts, factor: _opts?.pluginOpt?.factor, panButton: _opts?.PluginOpt?.panButton }),
  ];
}

export function OhlcChart({ _opts, _id }) {
  const {
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
    pluginOpt,
  } = _opts;

  let _chartOpt = {
    ...initOpts,
    ...chartOpt,
    series: [
      {},
      ...taConfig["ma"].map((i, idx) => ({
        stroke: idx >= chartColorArray.length ? chartColorArray.at(-1) : chartColorArray[idx],
      })),
      ...taConfig["bbands"].map((i, idx) => ({
        stroke: chartColorArray.at(-1),
        dash: [10, 10],
      })),
    ],
    plugins: [...createPlugin(_opts, _id)],
  };
  if ([undefined, null].indexOf(pluginOpt?.panButton) == -1) {
    _chartOpt["cursor"] = { ..._chartOpt["cursor"], drag: { x: false, y: false } };
  }
  _chartOpt = setSize(_chartOpt);
  // _chartOpt["scales"]["x"]["range"] = (u, dataMin, dataMax) => {
  //   console.log(dataMin, dataMax);
  //   return [dataMin - 2, dataMax + 2];
  // };
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

  return (
    <div>
      {chartOpt.show ? (
        <UplotReact
          options={_chartOpt}
          data={_chartData}
          // target={target}
          onCreate={(u) => {}}
          onDelete={(u) => {}}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export function SubChart({ _opts, _id }) {
  const {
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
    pluginOpt,
  } = _opts;

  let _subLable = ["rsi"];
  let _subOpt = {
    ...initOpts,
    ...subOpt,
    series: [
      {},
      ..._subLable.map((i, idx) => ({
        stroke: idx >= subColorArray.length ? subColorArray.at(-1) : subColorArray[idx],
      })),
    ],
    plugins: [...createPlugin(_opts, _id)],
  };
  if ([undefined, null].indexOf(pluginOpt?.panButton) == -1) {
    _subOpt["cursor"] = { ..._subOpt["cursor"], drag: { x: false, y: false } };
  }

  _subOpt = setSize(_subOpt);
  // _subOpt["scales"]["x"]["range"] = (u, dataMin, dataMax) => {
  //   return [dataMin - 2, dataMax + 2];
  // };
  let _subData = [ohlcData["time"], ..._subLable.map((i) => taData[i])];

  return (
    <div>
      {subOpt.show ? (
        <UplotReact
          options={_subOpt}
          data={_subData}
          // target={target}
          onCreate={(u) => {}}
          onDelete={(u) => {}}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export function StoreChart({ _opts, _id }) {
  const {
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
    pluginOpt,
  } = _opts;

  let _storeLable = ["money_up", "money_cur_up", "money_down", "money_cur_down", "money"];
  let _storeOpt = {
    ...initOpts,
    ...storeOpt,
    series: [
      {},
      ..._storeLable.map((i, idx) => ({
        stroke: idx >= storeColorArray.length ? storeColorArray.at(-1) : storeColorArray[idx],
      })),
    ],
    plugins: [...createPlugin(_opts, _id)],
  };
  if ([undefined, null].indexOf(pluginOpt?.panButton) == -1) {
    _storeOpt["cursor"] = { ..._storeOpt["cursor"], drag: { x: false, y: false } };
  }
  _storeOpt = setSize(_storeOpt);
  // _storeOpt["scales"]["x"]["range"] = (u, dataMin, dataMax) => {
  //   console.log("store", dataMin, dataMax);
  //   return [dataMin - 2, dataMax + 2];
  // };
  let _storeData = [ohlcData["time"], ..._storeLable.map((i) => storeData[i])];
  return (
    <div>
      {storeOpt.show ? (
        <UplotReact
          options={_storeOpt}
          data={_storeData}
          // target={target}
          onCreate={(u) => {}}
          onDelete={(u) => {}}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
export function Chart(_opts) {
  return (
    <div>
      <OhlcChart _opts={_opts} _id={"ohlcChart"} />
      <SubChart _opts={_opts} _id={"subChart"} />
      <StoreChart _opts={_opts} _id={"storeChart"} />
    </div>
  );
}
