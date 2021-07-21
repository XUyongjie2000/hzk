import React from "react";
import { HomeAPI } from "../../api";
import NavHeader from "../../components/NavHeader/NavHeader";
import { Toast } from "antd-mobile";
import { httpGet } from "../../utils/axios/http";
import getCurrentCity from "../../utils/currentCity/getCurrentCity";
import "./Map.css";
const BMap = window.BMap;

const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
};
class Map extends React.Component {
  state = {
    list: [],
    isShow: false,
  };
  //当页面渲染完成就要加载地图
  componentDidMount() {
    // //IP定位
    // var myCity = new window.BMap.LocalCity();
    // myCity.get((result) => {
    //   var cityName = result.name;
    //   map.setCenter(cityName);
    //   console.log(result);
    // });
    this.initMap();
  }
  async initMap() {
    // //通过new操作符号可以创建一个地图实例
    const map = new BMap.Map("container");
    this.map = map;
    //获取当前定位城市
    const { label, value } = await getCurrentCity();
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          map.centerAndZoom(point, 11);
          //平移缩放控件
          map.addControl(new BMap.NavigationControl());
          //缩略地图
          map.addControl(new BMap.ScaleControl());
          //调用renderOverlays()渲染覆盖物
          this.renderOverlays(value);
        }
      },
      label
    );
  }
  //获取房源数据（获取缩放级别 获取覆盖物类型）getTypeAndZoom()
  renderOverlays = async (id) => {
    //获取房源数据
    Toast.loading("加载中...", 0, null, false);
    const res = await httpGet(HomeAPI.map, { id });
    Toast.hide();
    //调用GetTy配A你的Zoom（） 为了获取缩放级别和覆盖物类型
    const { type, nextLevel } = this.getTypeAndZoom();
    // console.log(type, nextLevel);
    //遍历房源数据（为了渲染覆盖物）
    res.body.forEach((item) => {
      //调用渲染覆盖物的方法 createOverlays()
      this.createOverlays(type, nextLevel, item);
    });
  };
  //获取覆盖物类型 和缩放级别
  getTypeAndZoom = () => {
    // 计算要绘制的覆盖物类型和下一个缩放级别
    // 区   -> 11 ，范围：>=10 <12
    // 镇   -> 13 ，范围：>=12 <14
    // 小区 -> 15 ，范围：>=14 <16

    //获取当前级别(https://mapopen-pub-jsapi.bj.bcebos.com/jsapi/reference/jsapi_reference.html#a0b0)
    // 判断当前级别是在哪个范围之内
    const curZoom = this.map.getZoom();
    console.log(curZoom);
    //声明 类型 和下一级别 变量
    let type, nextLevel;
    //判断当前级别是在哪个范围之内
    if (curZoom >= 10 && curZoom < 12) {
      //当缩放级别在11的时候 渲染的是区级别的 并且圆形的覆盖物

      //给下一级别赋值
      type = "circle";
      nextLevel = 13;
    } else if (curZoom >= 12 && curZoom < 14) {
      //当缩放级别在13的时候 渲染的是镇级别的 并且圆形的覆盖物
      type = "circle";
      nextLevel = 15;
    } else if (curZoom >= 14 && curZoom < 16) {
      //当缩放级别在15的时候 渲染的是小区级别的 并且方形的覆盖物
      type = "rect";
    }
    return {
      type,
      nextLevel,
    };
  };

  //判断渲染什么样的覆盖物
  createOverlays = (type, level, item) => {
    // 解构 经纬度 房源数量 区域的名字
    const {
      coord: { latitude, longitude },
      count,
      label,
      value,
    } = item;
    //覆盖物的坐标
    const point = new BMap.Point(longitude, latitude);
    //判断type类型是否是circle
    if (type === "circle") {
      //如果是 调用createCircle()方法 并且传递参数
      this.createCircle(point, count, label, value, level);
    } else if (type === "rect") {
      // 如果是rect 调用createRect()方法,并传递参数
      this.createRect(point, count, label, value);
    }
  };
  //绘制圆形覆盖物
  createCircle = (point, count, areaName, value, level) => {
    // const point = new BMap.point();
    // 添加覆盖物(new BMap.Marker(point)这个是标记，但是我们不需要他)
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(35, -35), //设置文本偏移量
    };
    //创建文本标注对象
    const label = new BMap.Label("", opts); // 创建文本标注对象
    //给覆盖物 设置内容
    label.setContent(`<div class="bubble">
            <p class="name">${areaName}</p>
            <p>${count}</p>
          </div>`);
    //给覆盖物设置样式
    label.setStyle(labelStyle);
    //给覆盖物点击的时候（safari中点击不了）
    label.addEventListener("click", (e) => {
      // console.log("我被点击了", e);
      //清除覆盖物(为什么要使用setTimeOut？ 为了消除 浏览器中报的错误)
      setTimeout(() => {
        this.map.clearOverlays();
      }, 0);
      //渲染新的覆盖物
      this.renderOverlays(value);
      //设置地图的中心点和放大级别
      this.map.centerAndZoom(point, level);
    });
    this.map.addOverlay(label);
  };

  //绘制 方形覆盖物
  createRect = (point, count, areaName, cityId) => {
    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -28), //设置文本偏移量
    };
    //创建文本标注对象
    const label = new BMap.Label("", opts); // 创建文本标注对象
    //给覆盖物 设置内容
    label.setContent(`
    <div class="rect">
    <span class="housename">${areaName}</span>
    <span class="housenum">${count}套</span>
    <i class="arrow"></i>
  </div>`);
    //给覆盖物设置样式
    label.setStyle(labelStyle);
    //给覆盖物点击的时候（safari中点击不了）
    label.addEventListener("click", (e) => {
      // console.log("点击了小区中的房屋", cityId);
      // const res = this.getCommunityHouses(cityId);
      // console.log(res);
      const { clientX, clientY } = e.changedTouches[0];
      console.log(clientX, clientY);
      // 中心点坐标
      // x: window.innerWidth/2
      // y: (window.innerHeight-330)/2

      this.map.panBy(
        window.innerWidth / 2 - clientX,
        (window.innerHeight - 330) / 2 - clientY
      );

      this.getCommunityHouses(cityId);
    });
    //给地图添加覆盖物
    this.map.addOverlay(label);

    this.map.addEventListener("touchstart", () => {
      this.setState({
        isShow: false,
      });
    });
  };
  getCommunityHouses = async (cityId) => {
    Toast.loading("加载中...", 0, null, false);
    const res = await httpGet(HomeAPI.houses, {
      cityId: cityId,
      start: 1,
      end: 20,
    });
    Toast.hide();
    // return res;
    console.log(res);
    this.setState({
      list: res.body.list,
      isShow: true,
    });
  };

  renderHouse = () => {
    return this.state.list.map((item, index) => (
      <div className="house" key={item.houseCode}>
        <div className="imgWrap">
          <img
            className="img"
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className="content">
          <h3 className="title">{item.title}</h3>
          <div className="desc">{item.desc}</div>
          <div>
            {item.tags.map((subItem, subIndex) => {
              let taga = subIndex >= 2 ? "tab3" : `tag${subIndex + 1}`;
              return (
                <span key={subIndex} className={["tag", taga].join(" ")}>
                  {subItem}
                </span>
              );
            })}
          </div>
          <div className="price">
            <span className="priceNum">{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ));
  };
  render() {
    return (
      <div className="map">
        <NavHeader>地图找房</NavHeader>
        {/* eslint-disable-next-line */}
        <div id="container"></div>
        {/* // 房屋列表结构 */}
        <div
          className={["houseList", this.state.isShow ? "show" : ""].join(" ")}
        >
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">{this.renderHouse()}</div>
        </div>
      </div>
    );
  }
}

export default Map;
