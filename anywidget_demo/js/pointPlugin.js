import uPlot from 'uplot';

export function seriesPointsPlugin({ value, ohlcvData, optObj, ohlcvDataList, ohlcvDataLabel, GCData, DCData, GCDCList } = {}) {

    function drawCircle(ctx, x, y, mode = "up", radius = 4, distance = 25, strokeWidth = 2) {
        if (mode == "up") {
            ctx.beginPath()
            ctx.arc(x, y + distance, radius, 0, 2 * Math.PI, false)

            ctx.fillStyle = "red"
            ctx.fill()
            // ctx.lineWidth = strokeWidth
            // ctx.strokeStyle = "red"
            // ctx.stroke()
        }
        if (mode == "down") {
            ctx.beginPath()
            ctx.arc(x, y - distance, radius, 0, 2 * Math.PI, false)

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
            if (GCDCList[0] <= GCData.length - 1 && GCData[GCDCList[0]][j]) {
                drawTriangle(ctx, cx + left, cy, "up");
            }
            if (GCDCList[1] <= GCData.length - 1 && GCData[GCDCList[1]][j]) {
                drawCircle(ctx, cx + left, cy, "up");
            }
            if (GCDCList[0] <= DCData.length - 1 && DCData[GCDCList[0]][j]) {
                drawTriangle(ctx, cx + left, cy, "down");
            }
            if (GCDCList[1] <= DCData.length - 1 && DCData[GCDCList[1]][j]) {
                drawCircle(ctx, cx + left, cy, "down");
            }
            j++;
        };

        ctx.restore();
    }

    return {
        opts: (u, opts) => {
            opts.series.forEach((s, i) => {
                if (i == 1 && optObj.id == "ohlcvData") {
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
