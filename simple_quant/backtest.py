import pandas as pd


def stop_lose(ta_dict, way="up", mode="sl", wait=30, stop=10, rate=2):
    """ """
    close, throughClose, createClose, atr, throughAtr = (
        ta_dict["close"],
        ta_dict["throughClose"],
        ta_dict["createClose"],
        ta_dict["atr"],
        ta_dict["throughAtr"],
    )
    up_1 = close <= createClose - stop
    down_1 = close >= createClose + stop
    up_2 = close >= createClose + wait
    down_2 = close <= createClose - wait
    up_3 = close <= throughClose - stop
    down_3 = close >= throughClose + stop
    up_4 = throughClose - createClose >= wait
    down_4 = -(throughClose - createClose) >= wait
    up_5 = close <= throughClose - (rate * throughAtr)  # similarity up_3
    down_5 = close >= throughClose + (rate * throughAtr)
    if mode == "sl":
        if way == "up":
            return up_2 | up_1
        if way == "down":
            return down_2 | down_1
    if mode == "tsl":
        if way == "up":
            return up_3
        if way == "down":
            return down_3
    if mode == "tsl2":
        if way == "up":
            return (up_3 & up_4) | up_1
        if way == "down":
            return (down_3 & down_4) | down_1
    if mode == "tsl_atr":
        if way == "up":
            return up_5
        if way == "down":
            return down_5


def backtest(
    gcdc_data, ohlc_data, ta_data, way="up", mode="sl", wait=30, stop=10, rate=2
):
    gcdc_data[f"Entries"] = False
    gcdc_data[f"Exits"] = False
    createIndex = None  # 开仓位置
    throughIndex = None  # 开仓之后的过去最高位置
    for row in gcdc_data.itertuples():
        if createIndex == None:
            if row.TS_Trades == 1:
                createIndex = row.Index
                throughIndex = row.Index
                gcdc_data.loc[row.Index, f"Entries"] = True
        else:
            ta_dict = {
                "close": ohlc_data.loc[row.Index, "close"],
                "throughClose": ohlc_data.loc[throughIndex, "close"],
                "createClose": ohlc_data.loc[createIndex, "close"],
                "atr": ta_data.loc[row.Index, "atr"],
                "throughAtr": ta_data.loc[throughIndex, "atr"],
            }
            close, throughClose = ta_dict["close"], ta_dict["throughClose"]
            if stop_lose(ta_dict, way=way, mode=mode, wait=wait, stop=stop, rate=rate):
                createIndex = None
                throughIndex = None
                gcdc_data.loc[row.Index, f"Exits"] = True
            elif way == "up" and close > throughClose:
                throughIndex = row.Index
            elif way == "down" and close < throughClose:
                throughIndex = row.Index


def analysis_data(ohlc_data, entries, exits, mode="up"):
    store = {
        f"money": [],
        f"money_cur": [],
        f"success": [],
        f"failure": [],
    }
    createIndex = None  # 开仓位置
    money = 0
    money_cur = 0
    last_spread = 0
    for row in ohlc_data.itertuples():
        success = False
        failure = False
        if entries[row.Index]:
            createIndex = row.Index

        if createIndex != None:
            close = ohlc_data.loc[row.Index, "close"]
            createClose = ohlc_data.loc[createIndex, "close"]
            spread = close - createClose if mode == "up" else -(close - createClose)
            money_cur = money_cur - last_spread + spread
            last_spread = spread

            if exits[row.Index]:
                if spread > 0:
                    success = True if mode == "up" else False
                else:
                    failure = True if mode == "down" else False
                money = money + spread
                createIndex = None
                last_spread = 0

        store[f"money"].append(money)
        store[f"money_cur"].append(money_cur)
        store[f"success"].append(success)
        store[f"failure"].append(failure)

    data = pd.DataFrame(data=store)
    data.insert(loc=0, column="time", value=ohlc_data["time"])
    return data
