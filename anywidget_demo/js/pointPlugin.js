import uPlot from 'uplot';

export function seriesPointsPlugin({
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
    function drawCircle(ctx, x, y, mode = "up", radius = 4, distance = 20, strokeWidth = 2) {
        if (mode == "up") {
            ctx.beginPath()
            ctx.arc(x, y - distance, radius, 0, 2 * Math.PI, false)

            ctx.fillStyle = "red"
            ctx.fill()
            // ctx.lineWidth = strokeWidth
            // ctx.strokeStyle = "red"
            // ctx.stroke()
        }
        if (mode == "down") {
            ctx.beginPath()
            ctx.arc(x, y + distance, radius, 0, 2 * Math.PI, false)

            ctx.fillStyle = "blue"
            ctx.fill()
            // ctx.lineWidth = strokeWidth
            // ctx.strokeStyle = "red"
            // ctx.stroke()
        }
    }

    function drawTriangle(ctx, cx, cy, mode = "up", radius = 6, distance = 20) {
        if (mode == "up") {
            ctx.beginPath();
            ctx.moveTo(cx - radius, cy + distance);
            ctx.lineTo(cx + radius, cy + distance);
            ctx.lineTo(cx, cy + radius);
            ctx.fillStyle = "red"
            ctx.fill();
        }
        if (mode == "down") {
            ctx.beginPath();
            ctx.moveTo(cx - radius, cy - distance);
            ctx.lineTo(cx + radius, cy - distance);
            ctx.lineTo(cx, cy - radius);
            ctx.fillStyle = "blue"
            ctx.fill();
        }
    }

    const toPosX = (x, u) => {
        return u.valToPos(u.data[0].findIndex((k) => x === k), 'x')
    }

    function drawPoints(u, i, i0, i1) {
        let { left, top, width, height } = u.bbox;

        let { ctx } = u;
        let { _stroke, scale } = u.series[i];

        ctx.save();

        ctx.fillStyle = _stroke;

        let j = i0;
        while (j <= i1) {
            let cx = Math.round(toPosX(u.data[0][j], u));
            let cy = Math.round(u.valToPos(u.data[i][j], scale, true));


            let _open = ohlcData["open"][j]
            let _high = ohlcData["high"][j]
            let _low = ohlcData["low"][j]
            let _close = ohlcData["close"][j]

            const posOpen = u.valToPos(_open, "y", true)
            const posHigh = u.valToPos(_high, "y", true)
            const posLow = u.valToPos(_low, "y", true)
            const posClose = u.valToPos(_close, "y", true)

            if (gcData["Entries"][j]) {
                drawTriangle(ctx, cx + left, posLow, "up");
            }
            if (gcData["Exits"][j]) {
                drawCircle(ctx, cx + left, posHigh, "up");
            }
            if (dcData["Entries"][j]) {
                drawTriangle(ctx, cx + left, posHigh, "down");
            }
            if (dcData["Exits"][j]) {
                drawCircle(ctx, cx + left, posLow, "down");
            }
            j++;
        };

        // ctx.restore();
    }

    return {
        opts: (u, opts) => {
            opts.series.forEach((s, i) => {
                if (i == 1 && _id == "ohlcChart") {
                    uPlot.assign(s, {
                        points: {
                            show: drawPoints,
                        }
                    });
                }
            });
        }
    };
}
