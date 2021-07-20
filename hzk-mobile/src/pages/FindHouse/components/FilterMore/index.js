import React, { Component } from "react";

import FilterFooter from "../FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue,
  };
  handleChange = (val) => {
    //方便操作 selectedValues(能用const 就用const 如果const报错 let)
    const newSelectedVals = [...this.state.selectedValues];

    //判断 item是否存在newSelectedVals
    if (newSelectedVals.indexOf(val) > -1) {
      //如果存在 那么把val从 newSelectedVals中移除
      // eslint-disable-next-line
      newSelectedVals = newSelectedVals.filter((item) => item !== val);
    } else {
      //如果不存在 那么把val添加到newSelectedVals
      newSelectedVals.push(val);
    }
    //把newSelectedVals设置给selectedValues
    this.setState(
      {
        selectedValues: newSelectedVals,
      },
      () => {
        this.props.onHandlerMore(this.props.type, this.state.selectedValues);
      }
    );
  };
  // 渲染标签
  renderFilters(data) {
    // console.log(data);
    // 高亮类名： styles.tagActive
    return (
      data &&
      data.map((item) => {
        const isSelected = this.state.selectedValues.indexOf(item.value) > -1;
        // console.log(isSelected);
        return (
          <span
            key={item.value}
            className={[styles.tag, isSelected ? styles.tagActive : ""].join(
              " "
            )}
            onClick={() => this.handleChange(item.value)}
          >
            {item.label}
          </span>
        );
      })
    );
  }

  render() {
    let {
      type,
      data: { roomType, oriented, floor, characteristic },
      onOk,
      onCancel,
      // eslint-disable-next-line
      onHandlerMore,
    } = this.props;
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          cancelText="清除"
          onCancel={() => onCancel(type)}
          onOk={() => onOk(type, this.state.selectedValues)}
          className={styles.footer}
        />
      </div>
    );
  }
}
