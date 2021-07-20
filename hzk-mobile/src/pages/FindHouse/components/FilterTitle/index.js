import React from "react";

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" },
];
//接收并结构 Filter传递过来的OnClick方法
export default function FilterTitle({ titleSelectedStatus, onClick }) {
  // console.log(onClick);
  return (
    <Flex align="center" className={styles.root}>
      {/* 选中类名： selected */}
      {titleList.map((item) => {
        //3.获取Filter传递过来的数据里面的boolean
        // console.log(props.titleSelectedStatus);
        const isSelected = titleSelectedStatus[item.type];
        return (
          //给Flex.Item添加onClick事件 并且把item.type传递给父组件
          <Flex.Item key={item.type} onClick={() => onClick(item.type)}>
            {/* <span className={[styles.dropdown, styles.selected].join(" ")}> */}
            {/* 4 判断Filter传递过来数据里面的boolean如果是true 添加styles.swlected */}
            <span
              className={[
                styles.dropdown,
                isSelected ? styles.selected : "",
              ].join(" ")}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
  );
}
