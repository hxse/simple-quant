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


def backtest(GCDCData, ohlcvData, way="up", mode="sl", wait=30, stop=10, rate=2):
    GCDCData[f"{mode.upper()}_Entries"] = False
    GCDCData[f"{mode.upper()}_Exits"] = False
    createIndex = None  # 开仓位置
    throughIndex = None  # 开仓之后的过去最高位置
    for row in GCDCData.itertuples():
        if createIndex == None:
            if row.TS_Trades == 1:
                createIndex = row.Index
                throughIndex = row.Index
                GCDCData.loc[row.Index, f"{mode.upper()}_Entries"] = True
        else:
            ta_dict = {
                "close": ohlcvData.loc[row.Index, "close"],
                "throughClose": ohlcvData.loc[throughIndex, "close"],
                "createClose": ohlcvData.loc[createIndex, "close"],
                "atr": ohlcvData.loc[row.Index, "atr"],
                "throughAtr": ohlcvData.loc[throughIndex, "atr"],
            }
            close, throughClose = ta_dict["close"], ta_dict["throughClose"]
            if stop_lose(ta_dict, way=way, mode=mode, wait=wait, stop=stop, rate=rate):
                createIndex = None
                throughIndex = None
                GCDCData.loc[row.Index, f"{mode.upper()}_Exits"] = True
            elif way == "up" and close > throughClose:
                throughIndex = row.Index
            elif way == "down" and close < throughClose:
                throughIndex = row.Index


def analysis_data(ohlcvData, entries, exits, mode="up"):
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
    for row in ohlcvData.itertuples():
        success = False
        failure = False
        if entries[row.Index]:
            createIndex = row.Index

        if createIndex != None:
            close = ohlcvData.loc[row.Index, "close"]
            createClose = ohlcvData.loc[createIndex, "close"]
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
    data.insert(loc=0, column="time", value=ohlcvData["time"])
    return data
