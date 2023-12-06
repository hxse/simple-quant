config = {
    "refresh": True,
    "test1": [
        {
            "name": "SHFE.rb2401",
            # "name": "CZCE.MA401",
            # "name": "DCE.m2401",
            # "name": "CZCE.RM401",
            # "name": "DCE.c2401",
            # "name": "CZCE.TA401",
            "frequency": "300s",  # 15s, 30s, 60s, 300s, 900s, 1800s
            "count": 2000,
            "update_count": 10,
            "sleep": 4,
        },
        {
            "name": "SHFE.rb2401",
            "frequency": "900s",  # 1d, 7d
            "count": 1000,
            "update_count": 10,
            "sleep": 4,
        },
        {
            "name": "SHFE.rb2401",
            "frequency": "1800s",  # 1d, 7d
            "count": 500,
            "update_count": 10,
            "sleep": 4,
        },
    ],
    "fields": [
        "name",
        "level",
        "date",
        "time",
        "open",
        "high",
        "low",
        "close",
        "closeGt",
        "closeLt",
        "closeGtDiff",
        "closeLtDiff",
        "mode",
        "lazy_close",
        "current_close",
    ],
}

strategy = {
    "base_balance": 10000,
    # "chart_period": "5Min",
    # "chart_start": "2021-08-30 18:00:00",
    # "chart_stop": "2021-09-06 16:39:00",
    # "comission": 0.01,
    "data_points": [
        # transformer 要一致, name 不能一样
        # ready,就是直接运行指标
        # running,是先和ready一样直接运行指标, 然后等exit的时候, 再根据持仓fill一遍
        {"args": [3], "transformer": "HHV", "name": "hhv", "on": "ready"},
        {"args": [3], "transformer": "LLV", "name": "llv", "on": "ready"},
        {"args": [3], "transformer": "HHV", "name": "exit_hhv", "on": "running"},
        {"args": [3], "transformer": "LLV", "name": "exit_llv", "on": "running"},
        {"args": [4], "transformer": "MA", "name": "ma_short", "on": "ready"},
        {"args": [8], "transformer": "MA", "name": "ma_long", "on": "ready"},
        # {"args": [4], "transformer": "BOLL_U", "name": "boll_short_u", "on": "ready"},
        # {"args": [4], "transformer": "BOLL_D", "name": "boll_short_d", "on": "ready"},
        # {"args": [8], "transformer": "BOLL_U", "name": "boll_short_u", "on": "ready"},
        # {"args": [8], "transformer": "BOLL_D", "name": "boll_short_d", "on": "ready"},
    ],
    "enter": [[["close", 0], ">=", ["ma_long", 1]], ["close", ">", "ma_short"]],
    "exit": [["close", "<=", "exit_hhv"]],
}
