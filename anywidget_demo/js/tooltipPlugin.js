import { placement } from "./tool";

const toPosX = (x, u) => {
    return u.valToPos(u.data[0].findIndex((k) => x === k), 'x')
}

export function tooltipPlugin({
    _id,
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
    pluginOpt
}) {
    function setBoard(u, idx) {
        const ohlcBoard = document.querySelector(`#ohlcBoard_${pluginOpt.boardIdx}`)
        const taBoard = document.querySelector(`#taBoard_${pluginOpt.boardIdx}`)
        const storeBoard = document.querySelector(`#storeBoard_${pluginOpt.boardIdx}`)

        if (_id == "ohlcChart" || _id == "subChart") {
            const x = u.data[0][idx];
            let time = new Date(x * 1000).toLocaleString()
            let open = ohlcData["open"][idx]
            let high = ohlcData["high"][idx]
            let low = ohlcData["low"][idx]
            let close = ohlcData["close"][idx]
            let sma_str = taConfig["ma"].map((i) => `${i}: ${taData[i][idx]}`).join('')
            let _rsi = taData["rsi"][idx]
            let _atr = taData["atr"][idx]
            ohlcBoard.textContent = `${time} idx:${idx} open:${open} high:${high} low:${low} close:${close}`;
            taBoard.textContent = `${sma_str} rsi:${_rsi} atr:${_atr}`
        }
        if (_id == "storeChart") {
            const x = u.data[0][idx];
            const money = storeData["money"][idx]
            const money_up = storeData["money_up"][idx]
            const money_down = storeData["money_down"][idx]
            storeBoard.textContent = `money: ${money} money_up: ${money_up} money_down: ${money_down}`;
        }
    }
    return {
        hooks: {
            ready: u => {
                const idx = u.data[0].length - 1
                setBoard(u, idx)
            },
            setCursor: u => {
                const { left, top, idx } = u.cursor;
                setBoard(u, idx)
            }
        }
    };
}
