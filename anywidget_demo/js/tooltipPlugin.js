import { placement } from "./tool";
export function tooltipPlugin({
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
    storeOpt,
}) {
    return {
        hooks: {
            init: u => {

                const board = document.querySelector('#board')

                const over = u.over;

                over.onmouseenter = () => {
                    // board.style.display = "block";
                    // board.textContent = "mouse enter"
                };

                over.onmouseleave = () => {
                    // board.style.display = "none";
                    // board.textContent = "mouse leave"
                };
            },
            setCursor: u => {
                const ohlcvBoard = document.querySelector('#ohlcBoard')
                const storeBoard = document.querySelector('#storeBoard')

                const { left, top, idx } = u.cursor;
                if (id == "ohlcChart") {
                    console.log(1234124124)
                    const x = u.data[0][idx];
                    let time = new Date(x * 1000).toLocaleString()
                    let open = ohlcData["open"][idx]
                    let high = ohlcData["high"][idx]
                    let low = ohlcData["low"][idx]
                    let close = ohlcData["close"][idx]
                    // let sma_str = taConfig["ma"].map((i) => `${i}: ${taData[i][idx]}`).join('')
                    let _atr = taData["atr"][idx]
                    ohlcvBoard.textContent = `${time} idx:${idx} open:${open} high:${high} low:${low} close:${close} atr:${_atr}`;
                }
                if (id == "storeChart") {
                    const x = u.data[0][idx];
                    const money = storeData["money"][idx]
                    storeBoard.textContent = `${new Date(x * 1000).toLocaleString()} idx:${idx} ${money}`;
                }
            }
        }
    };
}
