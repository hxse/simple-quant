def run_strategy(data_list, data_map_list, strategy, mode):
    res_list = []
    for i in strategy[mode]:
        if type(i[0]) == list:
            name = i[0][0]
            level = i[0][1]
        else:
            name = i[0]
            level = 0
        if type(i[2]) == list:
            name2 = i[2][0]
            level2 = i[2][1]
        else:
            name2 = i[2]
            level2 = 0
        comparison = i[1]
        print(name, level, comparison, name2, level2)

        # col = data_list[level][name]
        # col2 = data_list[level2][name2]
        col = data_map_list[level][name]
        col2 = data_map_list[level2][name2]

        if comparison == ">":  # gt
            res = col > col2
        if comparison == "<":  # lt
            res = col < col2
        if comparison == ">=":  # ge
            res = col >= col2
        if comparison == "<=":  # le
            res = col <= col2
        if comparison == "==":  # le
            res = col == col2

        res_list.append(res)

    item = res_list[0]
    for k, v in enumerate(res_list):
        if k == 0:
            continue
        item = item & v
    return item


def run_entry(data_list, data_map_list, strategy):
    return run_strategy(data_list, data_map_list, strategy, "enter")


def run_exit(data_list, data_map_list, strategy, entry):
    name_list = []
    for i in strategy["data_points"]:
        if i["on"] == "running":
            name_list.append(i["name"])

    for i in data_map_list:
        for name in name_list:
            # 虽然ready已经生成过指标了, 但是这里再根据持仓重新填充一次
            i[name] = i.where(entry)[name].fillna(method="ffill")

    return run_strategy(data_list, data_map_list, strategy, "exit")
