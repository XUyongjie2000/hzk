import { Flex } from "antd-mobile";
import { withRouter } from "react-router-dom";
import styles from "./SearchHeader.module.css";

import PropTypes from "prop-types";
const SearchHeader = ({ history, cityName }) => {
  return (
    <Flex className={[styles.searchBox, "search-box"].join(" ")}>
      {/* 搜索框左边 */}
      <Flex className={styles.searchLeft}>
        <div
          className={styles.location}
          onClick={() => {
            history.push("/citylist");
          }}
        >
          <span>{cityName}</span>
          <i className="iconfont icon-arrow"></i>
        </div>
        <div
          className={styles.searchForm}
          onClick={() => {
            history.push("/search");
          }}
        >
          <i className="iconfont icon-search">
            <span>请输入小区地址</span>
          </i>
        </div>
      </Flex>
      {/* 地图 */}
      <i
        className="iconfont icon-map"
        onClick={() => {
          history.push("/map");
        }}
      />
    </Flex>
  );
};

SearchHeader.propTypes = {
    //cityName 城市名是string类型的数据 而且是必填的
  cityName: PropTypes.string.isRequired,
};
export default withRouter(SearchHeader);
