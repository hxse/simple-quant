from MyTT import MA, BOLL, HHV, LLV
import pandas as pd
from get_data import get_data, work_day, work_time


def transformer(data, i):
    if i["transformer"] == "HHV":
        data[i["name"]] = HHV(data["high"], i["args"][0])
    if i["transformer"] == "LLV":
        data[i["name"]] = LLV(data["low"], i["args"][0])
    if i["transformer"] == "MA":
        data[i["name"]] = MA(data["close"], i["args"][0])
    if i["transformer"] == "BOLL_U":
        UPPER, MID, LOWER = BOLL(data["close"], i["args"][0])
        data[i["name"]] = UPPER
    if i["transformer"] == "BOLL_D":
        UPPER, MID, LOWER = BOLL(data["close"], i["args"][0])
        data[i["name"]] = LOWER


def generating_technical(data, strategy, dropna=True):
    # closeData = data["close"].to_frame()
    for i in strategy["data_points"]:
        if i["on"] == "ready" or i["on"] == "running":
            transformer(data, i)

    if dropna:
        data.dropna(inplace=True)
        data.reset_index(drop=True, inplace=True)
    return data


def get_data_list(config, strategy, dropna=True):
    configTest = config["test1"]
    data_list = []
    for i in configTest:
        data = get_data(i["name"], i["frequency"], i["count"], config["refresh"])
        data = generating_technical(data, strategy, dropna=dropna)
        data_list.append(data)
    return data_list


def get_data_map(config, data_list, dropna=True):
    configTest = config["test1"]

    data_map_list = []
    n = 0
    for i, c in zip(data_list, configTest):
        # i["frequency"] = c["frequency"]
        _data_map = pd.merge_asof(data_list[0]["time"], i, on="time")
        if dropna:
            _data_map.dropna(inplace=True)
            _data_map.reset_index(drop=True, inplace=True)
        data_map_list.append(_data_map)

    data_map = data_list[0]["time"]
    for i, c in zip(data_map_list, configTest):
        i[c["frequency"]] = i["date"]
        data_map = pd.merge_asof(
            data_map, i.filter(items=["time", c["frequency"]]), on="time"
        )
        i.drop(c["frequency"], inplace=True, axis=1)

    if dropna:
        data_map.dropna(inplace=True)
        data_map.reset_index(drop=True, inplace=True)

    if data_map.count().time != data_list[0].count().time:
        print(
            f"warning: fast data, slow data, count not equal. data_map: {data_map.count().time} data_list: {[i.count().time for i in data_list]} data_map_list: {[i.count().time for i in data_map_list]}",
        )
    else:
        print(f"data count: {data_map.count().time}")

    return [data_map_list, data_map]
