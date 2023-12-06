# 简介
  * 一个简单的量化交易回测框架
  * 15分钟ma8相当于日线ma128,跨4个级别(乘4次2)
  * 循环直接重新计算就行了,毕竟不是高频,没必要搞增量更新,多此一举
# 参考
  * 用Numpy-Pandas写技术指标
    * https://github.com/mpquant/Python-Financial-Technical-Indicators-Pandas
  * json格式参考了这个库
    * https://github.com/jrmeier/fast-trade
# todo
  * 还没写完, todo看mian.py里面
