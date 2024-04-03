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

    # value = traitlets.Int(0).tag(sync=True)

    ohlcData = traitlets.Unicode("").tag(sync=True)
    taData = traitlets.Unicode("").tag(sync=True)
    gcData = traitlets.Unicode("").tag(sync=True)
    dcData = traitlets.Unicode("").tag(sync=True)
    storeData = traitlets.Unicode("").tag(sync=True)

    ohlcConfig = traitlets.Unicode("").tag(sync=True)
    taConfig = traitlets.Unicode("").tag(sync=True)
    btConfig = traitlets.Unicode("").tag(sync=True)

    chartOpt = traitlets.Unicode("").tag(sync=True)
    subOpt = traitlets.Unicode("").tag(sync=True)
    storeOpt = traitlets.Unicode("").tag(sync=True)
    pluginOpt = traitlets.Unicode("").tag(sync=True)

    # chartOpt = traitlets.Dict().tag(sync=True)
    # subOpt = traitlets.Dict().tag(sync=True)
    # storeOpt = traitlets.Dict().tag(sync=True)
