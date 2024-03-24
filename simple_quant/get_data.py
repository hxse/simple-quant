import pandas as pd
import numpy
import requests
import json
import datetime
import chinese_calendar


def work_day(time=None):
    if not time:
        time = datetime.datetime.now()
    data_is_holiday = chinese_calendar.is_holiday(time)
    data_is_workday = chinese_calendar.is_workday(time)
    return data_is_workday


def work_time(time=None):
    if not time:
        time = datetime.datetime.now()
    time_array = [["9:00", "11:30"], ["13:30", "15:00"], ["21:00", "23:00"]]
    for i in time_array:
        start = datetime.datetime.strptime(str(time.date()) + i[0], "%Y-%m-%d%H:%M")
        end = datetime.datetime.strptime(str(time.date()) + i[1], "%Y-%m-%d%H:%M")
        if time >= start and time <= end:
            return True
    return False


def timestamp2time(timestamp: numpy.float64) -> pd.Timestamp:
    return (
        pd.to_datetime(timestamp, unit="s")
        .tz_localize("UTC")
        .tz_convert("Asia/Shanghai")
    )


def time2timestamp(time: pd.Timestamp) -> float:
    return time.timestamp()


def get_data(name, frequency, count, refresh=True, end_time=None):
    # http://127.0.0.1:8000/ohlcv?name=SHFE.RB&frequency=300s&count=200&refresh=true&testUpdate=False&splitStart=5&splitEnd=10
    url = f"http://127.0.0.1:8000/ohlcv?name={name}&frequency={frequency}&count={count}&refresh={refresh}&end_time={end_time}"

    r = requests.get(url)
    if r.status_code == 200:
        jsonData = json.loads(r.text)
    else:
        raise ValueError(f"请求出错 {r.status_code} {r.text}")

    data = pd.DataFrame(
        {
            "time": jsonData[0],
            "open": jsonData[1],
            "high": jsonData[2],
            "low": jsonData[3],
            "close": jsonData[4],
            "volume": jsonData[5],
        }
    )
    data["date"] = (
        pd.to_datetime(data.time, unit="s")
        .dt.tz_localize("UTC")
        .dt.tz_convert("Asia/Shanghai")
    )
    # data["date"] = data["date"].astype(str)
    return data


def get_or_read_data(config, path):
    def get_data_func():
        return get_data(
            config["name"],
            config["frequency"],
            config["count"],
            config["refresh"],
            end_time=config["end_time"],
        )

    if config["end_time"] == None:
        data = get_data_func()
    else:
        if path.is_file():
            data = pd.read_csv(path)
        else:
            data = get_data_func()
            data_csv = data.to_csv(index=False)
            with open(path, "w", encoding="utf-8") as file:
                file.write(data_csv)
    return data
