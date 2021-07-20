import React from "react";
import { Toast } from "antd-mobile";
import NavHeader from "../../components/NavHeader/NavHeader";
import { List, AutoSizer } from "react-virtualized";
import "./CityList.css";

// 网络请求的配置
import { httpGet } from "../../utils/axios/http";
import { HomeAPI } from "../../api";
//格式化城市列表数据
import cityListFormat from "../../utils/cityformat/cityListFormat";
//获取当前城市
import getCurrentCity from "../..//utils/currentCity/getCurrentCity";
import { setCity } from "../../utils/cityStorage/cityStorage";

// List data as an array of strings
// const list = Array.from(new Array(1000)).map((item, index) => {
//   return `这是第${index}条数据`;
// });

// function rowRenderer({
//   key, // 每条数据的唯一标识
//   index, // 索引
//   style, // 当前行的样式
// }) {
//   return (
//     <div key={key} style={style}>
//       {list[index]}
//     </div>
//   );
// }

//格式化城市列表标题
function formatListTitle(title) {
  switch (title) {
    case "#":
      return "当前定位";
    case "hot":
      return "热门城市";
    default:
      return title.toUpperCase();
  }
}

const CITY_HAS_HOUSES = ["北京", "上海", "广州", "深圳"];
class CityList extends React.Component {
  state = {
    cityList: {},
    cityIndex: [],
    activeIndex: 0,
  };
  listRef = React.createRef();

  componentDidMount() {
    this.getCityList();
  }
  //获取城市信息
  async getCityList() {
    //城市列表
    const res = await httpGet(HomeAPI.city, { level: 1 });
    console.log(res);
    // 分析:
    // cityList  城市列表  { a:[{value:"安庆"}],b:[{value:"北京"},{value:"宝鸡"},{value: "北海"}],c:[{长沙},{成都},{长春},{常州},{常德}]}
    // cityIndex 城市列表的索引  --> 数组 short的首字母 添加到cityIndex   [a,b,c,d,e] -->  [A,B,C,D,E]
    const { cityList, cityIndex } = cityListFormat(res.body);
    console.log(cityList, cityIndex);

    //热门城市
    //发起请求 获取数据
    const resHot = await httpGet(HomeAPI.hot);
    console.log(resHot);
    //把数据放到citylist中去
    cityList["hot"] = resHot.body;
    //把热添加到cityIndex的前面
    cityIndex.unshift("hot");

    //当前定位城市
    // 回调函数
    // getCurrentCity((curCity) => {
    //   console.log(curCity);
    // })
    // 原始promise
    // getCurrentCity().then((result) => {
    //   console.log(result);
    // })
    //使用async await修饰的promise
    const resCur = await getCurrentCity();
    // console.log(resCur);
    cityList["#"] = [resCur];
    //把“#”添加到cityIndex前面
    cityIndex.unshift("#");

    this.setState({
      cityIndex: cityIndex,
      cityList: cityList,
    });
  }
  rowRenderer = ({
    key, // 每条数据的唯一标识
    index, // 索引
    style, // 当前行的样式
  }) => {
    const { cityList, cityIndex } = this.state;
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatListTitle(cityIndex[index])}</div>
        {cityList[cityIndex[index]].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => {
              // console.log(123);
              if (CITY_HAS_HOUSES.indexOf(item.label) > -1) {
                // 代表是北上广深这四个城市中的一个
                // console.log("有");
                setCity({ label: item.label, value: item.value });
                this.props.history.go(-1);
              } else {
                Toast.info("该城市无房源", 1);
              }
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };
  // index 是文档中说明的 如果是函数 该插件会自动返回index
  getRowHeight = ({ index }) => {
    return 36 + 50 * this.state.cityList[this.state.cityIndex[index]].length;
    // return 100;
  };

  //渲染城市索引列表
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state;

    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log(this.listRef);
          //点击某一项 让左边的城市列表跳到那个位置
          this.listRef.current.scrollToRow(index);
        }}
      >
        {/* 高亮类名 ：index-active */}
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  };
  // 滚动城市列表让对应的索引高亮
  onRowsRendered = ({ startIndex }) => {
    // console.log(startIndex);
    //如果滑动到的索引和当前索引不一样 ，那么就要重新设置activeIndex
    if (startIndex !== this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex,
      });
    }
  };
  render() {
    return (
      <div className="citylist">
        <div className="citylist-nav">
          <NavHeader>城市选择</NavHeader>
        </div>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              //容器的宽和高
              width={width}
              height={height}
              //有多少行（有多少条数据就有多少行）
              rowCount={this.state.cityIndex.length}
              //每一行的高=城市列表分类标题的高度+（50*当前分类的数组的长度）
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              ref={this.listRef}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
export default CityList;
