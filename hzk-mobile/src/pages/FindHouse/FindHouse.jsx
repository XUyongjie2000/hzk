import React from "react";

import { Flex } from "antd-mobile";
import { AutoSizer, List } from "react-virtualized";
import SearchHeader from "../../components/SearchHeader/SearchHeader";
import Filter from "./components/Filter";
import HouseItem from "../../components/HouseItem/HouseItem";
import getCurrentCity from "../../utils/currentCity/getCurrentCity";

import "./FindHouse.css";
import { httpGet } from "../../utils/axios/http";
import { HomeAPI } from "../../api";
class FindHouse extends React.Component {
  state = {
    cityName: "",
    list: [],
    count: "",
  };
  async componentDidMount() {
    const { label } = await getCurrentCity();

    this.setState({
      cityName: label,
    });
  }
  // 筛选的方法
  onFilter = (filters) => {
    console.log("findHose中获取的筛选条件", filters);
    // this.searchHouseList(filters);
    // this.filters = filters;
    this.searchHouseList(filters);
  };

  // 搜索房子
  searchHouseList = async (filters) => {
    // 获取cityId
    const { value } = await getCurrentCity();
    // 获取filters
    // 起始值

    const res = await httpGet(HomeAPI.houses, {
      cityId: value,
      ...filters,
      start: 1,
      end: 20,
    });

    // console.log("获取到的房屋数据", res);
    this.setState({
      list: res.body.list,
      count: res.body.count,
    });
  };
  rowRenderer = ({
    key, // 每条数据的唯一标识
    index, // 索引
    style, // 当前行的样式
  }) => {
    const { list } = this.state;
    const item = list[index];
    return <HouseItem key={key} {...item} style={style}></HouseItem>;
  };
  render() {
    const { count } = this.state;
    return (
      <div className="find-house" style={{ height: "100%" }}>
        {/* 顶部搜索导航 */}
        <Flex className="search-nav">
          <i className="iconfont icon-back"></i>
          <SearchHeader cityName={this.state.cityName}></SearchHeader>
        </Flex>
        {/* 筛选菜单 */}
        <Filter onFilter={this.onFilter}></Filter>
        {/* 房屋列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              //容器的宽和高
              width={width}
              height={height}
              //有多少行（有多少条数据就有多少行）
              rowCount={count}
              //每一行的高=城市列表分类标题的高度+（50*当前分类的数组的长度）
              rowHeight={120}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
export default FindHouse;
