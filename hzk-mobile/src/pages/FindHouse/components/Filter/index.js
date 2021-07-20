import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";

import getCurrentCity from "../../../../utils/currentCity/getCurrentCity";
import { httpGet } from "../../../../utils/axios/http";
import { HomeAPI } from "../../../../api";
export default class Filter extends Component {
  // 1.定义 判断filterTitle中选项高亮状态
  state = {
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false,
    },
    //3.1定义openType 用来表示 打开FilterPicker的标志
    openType: "",
    //定义一个用来储存筛选条件的键
    filtersData: {},
    // 设置默认选中值
    selectedValues: {
      area: ["area", "null"],
      mode: ["null"],
      price: ["null"],
      more: [],
    },
  };

  //在Filter组件中 发送请求 获取所有筛选条件数据
  async componentDidMount() {
    const { value } = await getCurrentCity();
    // console.log(value);
    const res = await httpGet(HomeAPI.condition, {
      id: value,
    });
    // console.log(res);
    this.setState({
      filtersData: res.body,
    });
  }
  //再 Ftiter组件中 声明 传递filterTitle
  onFilterTitle = (type) => {
    //6.1 获取两个状态 ：标题选中状态对象和筛选条件的选中值对象
    let { titleSelectedStatus, selectedValues } = this.state;
    //6.2根据当前标题选中对象，获取一个新的标题选中状态对象
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    //6.3使用Object.keys()方法，遍历标题选中状态对象
    Object.keys(titleSelectedStatus).forEach((item) => {
      // console.log(item);
      // console.log(selectedValues[item]);
      let selectedVal = selectedValues[item];
      console.log(selectedVal);
      //6.3.1 如果是当前标题 直接设置高亮
      if (type === item) {
        //6.3.1.1 如果type === item 说明为当前标题 设置为高亮
        newTitleSelectedStatus[item] = true;
      } else if (
        item === "area" &&
        (selectedVal.length === 3 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStatus[item] = true;
        //6.3.1.2 判断当前item确实是area 并且选中的值selectedValues和选中的值不一样 筛选条件呗选中了
      } else if (item === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "more" && selectedVal.length !== 0) {
        newTitleSelectedStatus[item] = true;
      } else {
        //以上情况都不满足的条件下 那就让我们的高亮取消掉
        newTitleSelectedStatus[item] = false;
      }
    });

    //把titleSelectedStatus中的某一个boolean值设置为true
    console.log("你好", type);
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      //3.2当点击FilterTitle中某一项的时候，把这一项的标志给openType
      openType: type,
    });
  };
  //3.5声明一个onCancel方法 让FilterPicker隐藏
  onCancel = (type) => {
    console.log("我在onCancel中接收到的type是", type);
    //6.1 获取两个状态 ：标题选中状态对象和筛选条件的选中值对象
    let { titleSelectedStatus, selectedValues } = this.state;
    //6.2根据当前标题选中对象，获取一个新的标题选中状态对象
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    //6.3使用Object.keys()方法，遍历标题选中状态对象
    Object.keys(titleSelectedStatus).forEach((item) => {
      let selectedVal = selectedValues[item];
      //6.3.1 如果是当前标题 直接设置高亮
      if (
        item === "area" &&
        (selectedVal.length === 3 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStatus[item] = true;
        //6.3.1.2 判断当前item确实是area 并且选中的值selectedValues和选中的值不一样 筛选条件呗选中了
      } else if (item === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "more" && selectedVal.length !== 0) {
        newTitleSelectedStatus[item] = true;
      } else {
        //以上情况都不满足的条件下 那就让我们的高亮取消掉
        newTitleSelectedStatus[item] = false;
      }
    });

    // 展开存在selectedValues中的值
    let newSelectedVals = { ...this.state.selectedValues };

    // 因为其他地方的取消 都没有 清除的功能
    // 只有more中的清除按钮有清除的功能
    // 因此判断 type是否是more
    // 如果是more 那么就把more中的数组清空

    if (type === "more") {
      newSelectedVals.more = [];
    }
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: "",
      selectedValues: newSelectedVals,
    });
  };
  //声明一个onOk方法 让FilterPicker隐藏
  onOk = (type, value) => {
    //6.1 获取两个状态 ：标题选中状态对象和筛选条件的选中值对象
    let { titleSelectedStatus, selectedValues } = this.state;
    //6.2根据当前标题选中对象，获取一个新的标题选中状态对象
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    //6.3使用Object.keys()方法，遍历标题选中状态对象
    Object.keys(titleSelectedStatus).forEach((item) => {
      let selectedVal = selectedValues[item];
      //6.3.1 如果是当前标题 直接设置高亮
      if (
        item === "area" &&
        (selectedVal.length === 3 || selectedVal[0] !== "area")
      ) {
        newTitleSelectedStatus[item] = true;
        //6.3.1.2 判断当前item确实是area 并且选中的值selectedValues和选中的值不一样 筛选条件呗选中了
      } else if (item === "mode" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[item] = true;
      } else if (item === "more" && selectedVal.length !== 0) {
        newTitleSelectedStatus[item] = true;
      } else {
        //以上情况都不满足的条件下 那就让我们的高亮取消掉
        newTitleSelectedStatus[item] = false;
      }
    });
    //组装数据
    let newSelectedVals = { ...this.state.selectedValues };
    // console.log(newSelectedVals);
    // console.log(type, value);
    let filters = {};
    //第一项 area
    // eslint-disable-next-line
    let areaKey = newSelectedVals.area[0];
    filters.areaKey =
      newSelectedVals.area.length === 3 && newSelectedVals.area[2] !== "null"
        ? newSelectedVals.area[2]
        : newSelectedVals.area[1];
    //第二项 mode
    filters.mode = newSelectedVals.mode[0];
    //第三项 price
    filters.price = newSelectedVals.price[0];
    //第四项 more
    filters.more = newSelectedVals.more.join(",");
    // console.log(filters);

    this.props.onFilter(filters);
    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: "",
    });
  };

  handlerChange = (type, value) => {
    console.log(type, value);
    this.setState(
      {
        selectedValues: {
          ...this.state.selectedValues,
          [type]: value,
        },
      },
      () => {
        console.log(this.state.selectedValues);
      }
    );
  };
  //封装一个renderFilterPicker 原因：因为接口把所有数据都返回了 需要根据type来拿不同类型的数据
  renderFilterPicker = () => {
    //结构state中的接口数据
    const {
      openType,
      filtersData: { area, subway, price, rentType },
      selectedValues,
    } = this.state;
    //判断不渲染怎么办
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null;
    }
    //传递每一项（price area mode 的数据）
    let data = null;
    //根据每一项(price\area\mode)渲染数据的列数
    let cols = 1;

    let defaultValue = selectedValues[openType];
    //判断是否是area
    //判断是否是mode
    //判断是否是price
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        break;
      case "price":
        data = price;
        break;
      default:
        break;
    }
    //渲染
    return (
      <FilterPicker
        defaultValue={defaultValue}
        type={openType}
        data={data}
        cols={cols}
        onCancel={this.onCancel}
        onOk={this.onOk}
        handlerChange={this.handlerChange}
      />
    );
  };
  //封装renderFilterMore方法
  renderFilterMore = () => {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
    } = this.state;
    const data = { roomType, oriented, floor, characteristic };
    const defaultValue = this.state.selectedValues[openType];
    //判断不渲染怎么办
    if (openType !== "more") {
      return null;
    }

    // console.log(this.state.filtersData);
    return (
      <FilterMore
        type={openType}
        data={data}
        onOk={this.onOk}
        onCancel={this.onCancel}
        onHandlerMore={this.handlerChange}
        defaultValue={defaultValue}
      />
    );
  };
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* 3.3 判断 openType是否是 area mode price 中的其中一个 
        如果是 渲染 否者不渲染 */}
        {openType === "area" || openType === "mode" || openType === "price" ? (
          <div className={styles.mask} onClick={() => this.onCancel()} />
        ) : null}
        {/* <div className={styles.mask} /> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          {/*  2.把状态数据通过父子传参传递给子组件 FilterTitle */}
          {/* 把声明好的onFilterTitle方法传递给FilterTitle组件 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onFilterTitle}
          />

          {/* 前三个菜单对应的内容： */}
          {/* 3.4 判断 openType是否是 area mode price 中的其中一个 
        如果是 渲染 否者不渲染 */}
          {/* {openType === "area" ||
          openType === "mode" ||
          openType === "price" ? (
            <FilterPicker onCancel={this.onCancel} onOk={this.onOk} />
          ) : null} */}
          {/* <FilterPicker /> */}
          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
