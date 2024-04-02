import pandas_ta as ta
import pandas as pd

# pdm add pandas_ta
# pdm add setuptools #这个不安装会报错


def add_ta(ohlc_data, ta_config={"ma_list": [4, 8, 16], "ma_name": "sma"}, round=2):
    ta_data = {}
    if "ma_name" in ta_config and "ma_list" in ta_config:
        ma_name = ta_config["ma_name"]
        ma_list = ta_config["ma_list"]

        for n in ma_list:
            if ma_name == "sma":
                ta_data[f"{ma_name}_{n}"] = ta.sma(ohlc_data["close"], length=n)
            if ma_name == "ema":
                ta_data[f"{ma_name}_{n}"] = ta.ema(ohlc_data["close"], length=n)
            if ma_name == "hma":
                ta_data[f"{ma_name}_{n}"] = ta.hma(ohlc_data["close"], length=n)

    if "bbands_length" in ta_config and "bbands_std" in ta_config:
        bbands_length = ta_config["bbands_length"]
        bbands_std = ta_config["bbands_std"]

        bbands = ta.bbands(
            ohlc_data["close"],
            length=bbands_length,
            std=bbands_std,
        )

        ta_data[f"BBL_{bbands_length}_{bbands_std}"] = bbands[
            f"BBL_{bbands_length}_{bbands_std}.0"
        ]
        ta_data[f"BBU_{bbands_length}_{bbands_std}"] = bbands[
            f"BBU_{bbands_length}_{bbands_std}.0"
        ]

    if "rsi_length" in ta_config:
        rsi_length = ta_config["rsi_length"]

        ta_data["rsi"] = ta.rsi(ohlc_data["close"], length=rsi_length)

    if "atr_length" in ta_config:
        atr_length = ta_config["atr_length"]
        # atr_multiple = indicator["atr_multiple"]

        ta_data["atr"] = ta.atr(
            ohlc_data["high"], ohlc_data["low"], ohlc_data["close"], length=atr_length
        )
        # res["atr"] = data["atr"] * atr_multiple

    ta_data = pd.DataFrame(data=ta_data)
    ta_data = ta_data.round(round)
    return ta_data


if __name__ == "__main__":
    from pathlib import Path

    cwd = Path().resolve()
    # cwd == PosixPath('/path/to/this/jupyter/ipynb/file's/directory/')

    # or this way, thanks @NunoAndré:
    # cwd = Path.cwd()
    print(cwd)
