from config import config, strategy
from process_data import get_data_list, get_data_map
from get_data import get_data, work_day, work_time
from backtest import run_entry, run_exit


def main(config, strategy):
    data_list = get_data_list(config, strategy)
    [data_map_list, data_map] = get_data_map(config, data_list=data_list)
    entry = run_entry(data_list, data_map_list, strategy)
    exit = run_exit(data_list, data_map_list, strategy, entry)
    print(entry)
    print(exit)
    # todo 快写好了,以后再写吧,因为回归传统交易了
    # todo entry规则和exit规则写好了, 后面把"按规则计算资金"写好就行了, 注意running指标可能有Nan


if __name__ == "__main__":
    main(config, strategy)
