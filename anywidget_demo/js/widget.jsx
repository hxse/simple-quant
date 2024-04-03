import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./widget.css";
import { Chart } from "./uplot-demo";
import { csvToArray, jsonToArray, transpose, convertArray } from "./tool";

const render = createRender(() => {
  // const [value, setValue] = useModelState("value");
  const [ohlcData] = useModelState("ohlcData");
  const [taData] = useModelState("taData");
  const [gcData] = useModelState("gcData");
  const [dcData] = useModelState("dcData");
  const [storeData] = useModelState("storeData");

  const [ohlcConfig] = useModelState("ohlcConfig");
  const [taConfig] = useModelState("taConfig");
  const [btConfig] = useModelState("btConfig");

  const [chartOpt] = useModelState("chartOpt");
  const [subOpt] = useModelState("subOpt");
  const [storeOpt] = useModelState("storeOpt");
  const [pluginOpt] = useModelState("pluginOpt");

  let ohlcDataObj = jsonToArray(ohlcData);
  let taDataObj = jsonToArray(taData);
  let storeDataObj = jsonToArray(storeData);
  let gcDataObj = jsonToArray(gcData);
  let dcDataObj = jsonToArray(dcData);
  console.log("dataObj:", {
    ohlcDataObj: ohlcDataObj,
    taDataObj: taDataObj,
    storeDataObj: storeDataObj,
    gcDataObj: gcDataObj,
    dcDataObj: dcDataObj,
  });

  let ohlcConfigObj = jsonToArray(ohlcConfig);
  let taConfigObj = jsonToArray(taConfig);
  let btConfigObj = jsonToArray(btConfig);
  console.log("configObj:", {
    ohlcConfigObj: ohlcConfigObj,
    taConfigObj: taConfigObj,
    btConfigObj: btConfigObj,
  });

  let chartOptObj = jsonToArray(chartOpt);
  let subOptObj = jsonToArray(subOpt);
  let storeOptObj = jsonToArray(storeOpt);
  let pluginOptObj = jsonToArray(pluginOpt);
  console.log("optObj:", {
    chartOptObj: chartOptObj,
    subOptObj: subOptObj,
    storeOptObj: storeOptObj,
    pluginOptObj: pluginOptObj,
  });

  return (
    <div>
      {Object.keys(ohlcDataObj).length > 0 ? (
        <div id={`ohlcBoard_${pluginOptObj.boardIdx}`}>{`ohlcBoard_${pluginOptObj.boardIdx}`}</div>
      ) : (
        ""
      )}
      {Object.keys(taDataObj).length > 0 ? (
        <div id={`taBoard_${pluginOptObj.boardIdx}`}>{`taBoard_${pluginOptObj.boardIdx}`}</div>
      ) : (
        ""
      )}
      {Object.keys(storeDataObj).length > 0 ? (
        <div id={`storeBoard_${pluginOptObj.boardIdx}`}>{`storeBoard_${pluginOptObj.boardIdx}`}</div>
      ) : (
        ""
      )}
      {
        <Chart
          id="chart"
          ohlcData={ohlcDataObj}
          taData={taDataObj}
          storeData={storeDataObj}
          gcData={gcDataObj}
          dcData={dcDataObj}
          ohlcConfig={ohlcConfigObj}
          taConfig={taConfigObj}
          btConfig={btConfigObj}
          chartOpt={chartOptObj}
          subOpt={subOptObj}
          storeOpt={storeOptObj}
          pluginOpt={pluginOptObj}
        ></Chart>
      }
    </div>
  );
});

export default { render };
