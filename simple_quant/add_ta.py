import pandas_ta as ta

# pdm add pandas_ta
# pdm add setuptools #这个不安装会报错


def add_ta(
    data,
    ma_name="sma",
    ma_list=[4, 8, 16],
    atr_length=14,
):
    for n in ma_list:
        if ma_name == "sma":
            data[f"{ma_name}_{n}"] = ta.sma(data["close"], length=n)
        if ma_name == "ema":
            data[f"{ma_name}_{n}"] = ta.ema(data["close"], length=n)
        if ma_name == "hma":
            data[f"{ma_name}_{n}"] = ta.hma(data["close"], length=n)

    data["atr"] = ta.atr(data["high"], data["low"], data["close"], length=atr_length)
    # data["atr"] = data["atr"] * 2

    data = data.round(2)

    return data


if __name__ == "__main__":
    from pathlib import Path

    cwd = Path().resolve()
    # cwd == PosixPath('/path/to/this/jupyter/ipynb/file's/directory/')

    # or this way, thanks @NunoAndré:
    # cwd = Path.cwd()
    print(cwd)
