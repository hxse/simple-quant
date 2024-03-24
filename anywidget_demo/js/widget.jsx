import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import "./widget.css";
import { Chart } from "./uplot-demo";
import { csvToArray, jsonToArray, transpose, convertArray } from "./tool";

const render = createRender(() => {
  const [value, setValue] = useModelState("value");
  const [ohlcvData, setOhlcvData] = useModelState("ohlcvData");
  const [optObj, setOptObj] = useModelState("optObj");
  const [ohlcvDataList, setOhlcvDataList] = useModelState("ohlcvDataList");
  const [ohlcvDataLabel, setOhlcvDataLabel] = useModelState("ohlcvDataLabel");
  const [storeData, setStoreData] = useModelState("storeData");
  const [storeList, setStoreList] = useModelState("storeList");
  const [storeOptObj, setStoreOptObj] = useModelState("storeOptObj");
  const [GCData, setGCData] = useModelState("GCData");
  const [DCData, setDCData] = useModelState("DCData");
  const [GCDCList, setGCDCList] = useModelState("GCDCList");

  console.log("optObj:", optObj);
  console.log("storeOptObj:", storeOptObj);
  console.log("ohlcvDataList:", ohlcvDataList);
  console.log("ohlcvDataLabel:", ohlcvDataLabel);
  console.log("storeList:", storeList);
  console.log("GCDCList", GCDCList);

  // let  ohlcvDataArray= csvToArray(ohlcvData)
  // ohlcvDataArray = transpose(ohlcvDataArray)
  // ohlcvDataArray = convertArray(ohlcvDataArray)
  let ohlcvDataArray = jsonToArray(ohlcvData);
  console.log("ohlcvData:", ohlcvDataArray);

  let storeDataArray = jsonToArray(storeData);
  console.log("storeData:", storeDataArray);

  let GCDataArray = jsonToArray(GCData);
  console.log("GCData:", GCDataArray);
  let DCDataArray = jsonToArray(DCData);
  console.log("DCData:", DCDataArray);

  return (
    <div>
      <button className="anywidget_demo-counter-button" onClick={() => setValue(value + 1)}>
        count is {value}
      </button>
      {ohlcvDataList && ohlcvDataList.length > 0 ? <div id="ohlcvBoard">ohlcvBoard</div> : ""}
      {storeList && storeList.length > 0 ? <div id="storeBoard">storeBoard</div> : ""}
      {ohlcvDataList && ohlcvDataList.length > 0 ? (
        <Chart
          id="ohlcvChart"
          value={value}
          optObj={optObj}
          ohlcvData={ohlcvDataArray}
          ohlcvDataList={ohlcvDataList}
          ohlcvDataLabel={ohlcvDataLabel}
          GCData={GCDataArray}
          DCData={DCDataArray}
          GCDCList={GCDCList}
        ></Chart>
      ) : (
        ""
      )}
      {storeList && storeList.length > 0 ? (
        <Chart
          id="storeBoard"
          value={value}
          optObj={storeOptObj}
          ohlcvData={storeDataArray}
          ohlcvDataList={storeList}
          GCData={GCDataArray}
          DCData={DCDataArray}
          GCDCList={GCDCList}
        ></Chart>
      ) : (
        ""
      )}
    </div>
  );
});

export default { render };
