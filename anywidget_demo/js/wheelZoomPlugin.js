import { placement } from "./tool";
import uPlot from 'uplot';

export function wheelZoomPlugin({
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

    const factorWheel = pluginOpt.factorWheel || 0.3
    const factorPan = pluginOpt.factorPan || 0.15
    const panButton = pluginOpt.panButton
    const scrollZoom = pluginOpt.scrollZoom
    const syncZoomPan = pluginOpt.syncZoomPan
    //factorWheel和factorPan是缩放倍数,大于0小于1,数字越大越快
    //panButton: null是关闭平移拖拽, 0是左键, 1是中键, 2是右键
    //scrollZoom: False是关闭滚轮缩放
    //syncZoomPan: False是关闭缩放平移的同步
    console.log('syncZoomPan', syncZoomPan)

    let xMin, xMax, yMin, yMax, xRange, yRange;

    function clamp(nRange, nMin, nMax, fRange, fMin, fMax) {
        if (nRange > fRange) {
            nMin = fMin;
            nMax = fMax;
        } else if (nMin < fMin) {
            nMin = fMin;
            nMax = fMin + nRange;
        } else if (nMax > fMax) {
            nMax = fMax;
            nMin = fMax - nRange;
        }

        return [nMin, nMax];
    }

    return {
        hooks: {
            init: (u, opts) => {
                if (!pluginOpt.chartObj) {
                    pluginOpt.chartObj = {}
                }
                pluginOpt.chartObj[_id] = u
            },
            ready: (u) => {
                xMin = u.scales.x.min;
                xMax = u.scales.x.max;
                yMin = u.scales.y.min;
                yMax = u.scales.y.max;

                xRange = xMax - xMin;
                yRange = yMax - yMin;

                let over = u.over;
                let rect = over.getBoundingClientRect();


                // wheel drag pan
                over.addEventListener("mousedown", (e) => {

                    if (e.button == panButton && panButton !== undefined && panButton !== null) {
                        //0鼠标左键,1中键,2右键,3后退键,4前进键
                        console.log('pan', panButton)
                        //	plot.style.cursor = "move";
                        e.preventDefault();

                        let left0 = e.clientX;
                        //	let top0 = e.clientY;

                        let scXMin0 = u.scales.x.min;
                        let scXMax0 = u.scales.x.max;

                        let xUnitsPerPx = u.posToVal(1, "x") - u.posToVal(0, "x");

                        function onmove(e) {
                            e.preventDefault();

                            let left1 = e.clientX;
                            //	let top1 = e.clientY;

                            let dx = xUnitsPerPx * (left1 - left0) / (1 - factorPan)

                            if (syncZoomPan) {
                                if (pluginOpt.chartObj) {
                                    for (let chartName of Object.keys(pluginOpt.chartObj)) {
                                        const chartPlot = pluginOpt.chartObj[chartName]
                                        chartPlot.setScale("x", {
                                            min: scXMin0 - dx,
                                            max: scXMax0 - dx,
                                        });
                                    }
                                }
                            } else {

                                u.setScale("x", {
                                    min: scXMin0 - dx,
                                    max: scXMax0 - dx,
                                });
                            }

                        }

                        function onup(e) {
                            document.removeEventListener("mousemove", onmove);
                            document.removeEventListener("mouseup", onup);
                        }

                        document.addEventListener("mousemove", onmove);
                        document.addEventListener("mouseup", onup);
                    }
                });

                // wheel scroll zoom
                over.addEventListener("wheel", (e) => {
                    if (!scrollZoom) {
                        return
                    }
                    e.preventDefault();

                    let { left, top } = u.cursor;

                    let leftPct = left / rect.width;
                    let btmPct = 1 - top / rect.height;
                    let xVal = u.posToVal(left, "x");
                    let yVal = u.posToVal(top, "y");
                    let oxRange = u.scales.x.max - u.scales.x.min;
                    let oyRange = u.scales.y.max - u.scales.y.min;

                    let nxRange = e.deltaY < 0 ? oxRange * (1 - factorWheel) : oxRange / (1 - factorWheel)
                    let nxMin = xVal - leftPct * nxRange;
                    let nxMax = nxMin + nxRange;
                    [nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax);

                    let nyRange = e.deltaY < 0 ? oyRange * factorWheel : oyRange * factorWheel;
                    let nyMin = yVal - btmPct * nyRange;
                    let nyMax = nyMin + nyRange;
                    [nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax);

                    u.batch(() => {
                        if (syncZoomPan) {
                            if (pluginOpt.chartObj) {
                                for (let chartName of Object.keys(pluginOpt.chartObj)) {
                                    const chartPlot = pluginOpt.chartObj[chartName]
                                    chartPlot.setScale("x", {
                                        min: nxMin,
                                        max: nxMax,
                                    });
                                }
                            }
                        } else {
                            u.setScale("x", {
                                min: nxMin,
                                max: nxMax,
                            });
                        }
                        // u.setScale("y", {
                        //   min: nyMin,
                        //   max: nyMax,
                        // });
                    });
                });
            },
        },
    };
}
