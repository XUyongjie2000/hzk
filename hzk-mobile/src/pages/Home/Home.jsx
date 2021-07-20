import React from "react";
import { Carousel, Flex, Grid } from "antd-mobile";
import SearchHeader from "../../components/SearchHeader/SearchHeader";
//网络请求的配置
import { httpGet } from "../../utils/axios/http";
import { HomeAPI } from "../../api";

// 获取当前定位城市
import getCurrentCity from "../../utils/currentCity/getCurrentCity";

import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";

//永远不变就定义成变量
const navList = [
  {
    title: "整租",
    path: "/findhouse",
    imgSrc: nav1,
  },
  {
    title: "合租",
    path: "/findhouse",
    imgSrc: nav2,
  },
  {
    title: "地图找房",
    path: "/findhouse",
    imgSrc: nav3,
  },
  {
    title: "去出租",
    path: "/findhouse",
    imgSrc: nav4,
  },
];
class Home extends React.Component {
  state = {
    //轮播图数据
    swiperData: [],
    //判断轮播图 数据是否加载完成
    isFinished: false,

    //租房小组
    groupData: [],
    //咨询
    newsData: [],
    //城市名称
    cityName: "广州",
    areaId: "",
  };
  //模拟异步请求
  componentDidMount() {
    //获取轮播图数据
    this.getSwiper();
    //获取租房小组数据
    this.getGroup();
    //获取咨询数据
    this.getNews();
    //获取城市名称
    this.getCityName();
  }

  //渲染城市名称
  async getCityName() {
    const { label, value } = await getCurrentCity();
    this.setState({
      cityName: label,
      areaId: value,
    });
  }
  //#region 渲染轮播图
  async getSwiper() {
    // let _this = this;
    // axios.get("http://localhost:8080/home/swiper").then(function (response) {
    //   if (response.data.status === 200) {
    //     _this.setState({
    //       swiperData: response.data.body,
    //       isFinished: true,
    //     });
    //   }
    // });
    const res = await httpGet(HomeAPI.swiper);
    // console.log(res);
    if (res.status === 200) {
      this.setState({
        swiperData: res.body,
        isFinished: true,
      });
    }
  }
  renderSwiper() {
    return this.state.swiperData.map((item) => (
      <a
        key={item.id}
        href="http://www.baidu.com"
        style={{
          display: "inline-block",
          width: "100%",
        }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt={item.alt}
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  }
  //#endregion 渲染轮播图完成
  //#region 渲染租房小组
  async getGroup() {
    const res = await httpGet(HomeAPI.group, {
      area: this.state.areaId,
    });
    // console.log(res);
    if (res.status === 200) {
      this.setState({
        groupData: res.body,
      });
    }
  }
  renderGroups() {
    return (
      <React.Fragment>
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        <Grid
          className="group-content"
          data={this.state.groupData}
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={(item) => (
            <Flex className="group-content-item">
              <div
                className="group-content-font"
                justify="between"
                key={item.id}
              >
                <h3>{item.title}</h3>
                <span>{item.desc}</span>
              </div>
              <div className="group-content-img">
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </div>
            </Flex>
          )}
        ></Grid>
      </React.Fragment>
    );
  }
  //#endregion 渲染租房小组完成
  //#region 渲染资讯
  async getNews() {
    const res = await httpGet(HomeAPI.news, {
      area: this.state.areaId,
    });
    // console.log(res);
    if (res.status === 200) {
      this.setState({
        newsData: res.body,
      });
    }
  }
  renderNews() {
    return this.state.newsData.map((item) => (
      <div className="news-item" key={item.id}>
        <img
          className="news-item-img"
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
        />
        <div className="news-item-conent">
          <p className="news-item-conent-title">{item.title}</p>
          <p className="news-item-conent=tips">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </p>
        </div>
      </div>
    ));
  }
  //#endregion渲染资讯
  render() {
    return (
      <div className="Home">
        <div className="swiper">
          {/* 搜索框 */}
          <SearchHeader cityName={this.state.cityName}></SearchHeader>
          {/* 轮播图 */}
          {this.state.isFinished ? (
            <Carousel autoplay infinite>
              {/* 如果isFinished这个state为false 那么就不调用getSwiper */}
              {/* 如果isFinished这个state 为true 那么就调用getSwiper */}
              {this.renderSwiper()}
            </Carousel>
          ) : (
            ""
          )}
        </div>
        {/* 导航 */}
        <Flex className="nav">
          {navList.map((item, index) => (
            <Flex.Item
              key={index}
              onClick={() => {
                this.props.history.push(item.path);
              }}
            >
              <img src={item.imgSrc} alt="" />
              <p>{item.title}</p>
            </Flex.Item>
          ))}

          {/* <Flex.Item
            onClick={() => {
              this.props.history.push("/findhouse");
            }}
          >
            <img src={nav1} alt="" />
            <p>整租</p>
          </Flex.Item>
          <Flex.Item
            onClick={() => {
              this.props.history.push("/findhouse");
            }}
          >
            <img src={nav2} alt="" />
            <p>合租</p>
          </Flex.Item>
          <Flex.Item
            onClick={() => {
              this.props.history.push("/findhouse");
            }}
          >
            <img src={nav3} alt="" />
            <p>地图找房</p>
          </Flex.Item>
          <Flex.Item
            onClick={() => {
              this.props.history.push("/findhouse");
            }}
          >
            <img src={nav4} alt="" />
            <p>去出租</p>
          </Flex.Item> */}
        </Flex>
        {/* 租房小组 */}
        <div className="group">{this.renderGroups()}</div>
        {/* 咨询 */}
        <div className="news">
          <h3>最新咨询</h3>
          {this.renderNews()}
        </div>
      </div>
    );
  }
}

export default Home;
