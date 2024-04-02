import { placement } from "./tool";
export function rangePlugin({
    id,
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
    storeOpt }) {

    return {
        hooks: {
            init: u => {
            },
            drawAxes: (u) => {
                //初始空白画布时触发

                // let [iMin, iMax] = u.series[0].idxs;
                // let maxHigh = Math.max(...ohlcData["high"])
                // let minLow = Math.min(...ohlcData["low"])
                // const posMaxHigh = u.valToPos(maxHigh, "y", true)
                // const posMinLow = u.valToPos(minLow, "y", true)

                // u.setScale("y", {
                //     min: maxHigh,
                //     max: minLow
                // });

            },
            setCursor: u => {

            }
        }
    };
}
