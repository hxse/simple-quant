import uPlot from 'uplot';

export function candlePlugin({
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
} = {}) {

    function drawCandle(u, i, i0, i1) {
        let { left, top, width, height } = u.bbox;

        let { ctx } = u;
        let { _stroke, scale } = u.series[i];

        let idx = i0;
        while (idx <= i1) {

            let _open = ohlcData["open"][idx]
            let _high = ohlcData["high"][idx]
            let _low = ohlcData["low"][idx]
            let _close = ohlcData["close"][idx]

            let [iMin, iMax] = u.series[0].idxs;

            const dx = iMax - iMin;
            const width = ((u.bbox.width / dx) / devicePixelRatio) * 0.8;
            const posX = u.valToPos(idx, "x", true)
            const posOpen = u.valToPos(_open, "y", true)
            const posHigh = u.valToPos(_high, "y", true)
            const posLow = u.valToPos(_low, "y", true)
            const posClose = u.valToPos(_close, "y", true)
            const left = posX - width / 2;
            // const xVal = u.scales.x.distr == 2 ? currIdx : u.data[0][currIdx];


            ctx.strokeStyle = _close > _open ? "rgb(255, 60, 60,0.8)" : "rgb(33, 164, 241,0.8)";
            ctx.fillStyle = _close > _open ? "rgb(255, 60, 60,0.8)" : "rgb(33, 164, 241,0.8)";
            ctx.setLineDash([]);

            if (_close == _open) {
                ctx.strokeStyle = "rgb(0, 0, 0,0.6)"
                ctx.beginPath();
                ctx.moveTo(posX, posHigh);
                ctx.lineTo(posX, posLow);
                ctx.stroke();
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.moveTo(posX, posClose);
                ctx.lineTo(posX, _close > _open ? posHigh : posLow);
                ctx.stroke();
                ctx.moveTo(posX, posOpen);
                ctx.lineTo(posX, _close > _open ? posLow : posHigh);
                ctx.stroke();
                ctx.closePath();
            }

            if (_close > _open) {
                ctx.fillRect(left, posOpen, width, (posClose - posOpen));
            }
            if (_close < _open) {
                ctx.fillRect(left, posOpen, width, posClose - posOpen);
            }
            if (_close == _open) {
                ctx.strokeRect(left, posOpen, width, posClose - posOpen);
            }
            idx++;
        };
    }

    return {
        hooks: {
            init: u => {
            },
            drawClear: (u) => {
                let [iMin, iMax] = u.series[0].idxs;
                drawCandle(u, 0, iMin, iMax)
            }
        }
    };
}
