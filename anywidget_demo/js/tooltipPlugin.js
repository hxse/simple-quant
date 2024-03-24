import { placement } from "./tool";
export function tooltipPlugin({ value, ohlcvData, optObj, ohlcvDataList, ohlcvDataLabel, GCData, DCData, GCDCList }) {

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
                const ohlcvBoard = document.querySelector('#ohlcvBoard')
                const storeBoard = document.querySelector('#storeBoard')

                const { left, top, idx } = u.cursor;
                if (optObj.id == "ohlcvData") {
                    const x = u.data[0][idx];
                    const y = u.data[1][idx];
                    const atr = ohlcvData[ohlcvDataLabel.indexOf("atr")][idx]
                    ohlcvBoard.textContent = `${new Date(x * 1000).toLocaleString()} idx:${idx} close:${y} atr:${atr}`;
                }
                if (optObj.id == "storeData") {
                    const x = u.data[0][idx];
                    const y = u.data[2][idx];
                    storeBoard.textContent = `${new Date(x * 1000).toLocaleString()} idx:${idx} ${y}`;
                }
            }
        }
    };
}
