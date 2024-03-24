import importlib.metadata
import pathlib

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("anywidget_demo")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class Counter(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"

    value = traitlets.Int(0).tag(sync=True)

    ohlcvData = traitlets.Unicode("").tag(sync=True)
    ohlcvDataList = traitlets.List().tag(sync=True)
    ohlcvDataLabel = traitlets.List().tag(sync=True)
    optObj = traitlets.Dict().tag(sync=True)

    storeData = traitlets.Unicode("").tag(sync=True)
    storeList = traitlets.List().tag(sync=True)
    storeOptObj = traitlets.Dict().tag(sync=True)

    GCData = traitlets.Unicode("").tag(sync=True)
    DCData = traitlets.Unicode("").tag(sync=True)
    GCDCList = traitlets.List().tag(sync=True)
