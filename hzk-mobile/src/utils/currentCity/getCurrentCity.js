import { httpGet } from "../axios/http";
import { HomeAPI } from "../../api";
import { getCity, setCity } from "../cityStorage/cityStorage";
const getCurrentCity = () => {
  //去localStorage中获取当前城市
  const curCity = getCity();
  //判断获取来的当前城市有没有
  if (!curCity) {
    return new Promise((resolve, reject) => {
      //如果没有 就要使用百度地图去获取
      var myCity = new window.BMap.LocalCity();
      myCity.get(async (result) => {
        const res = await httpGet(HomeAPI.info, {
          name: result.name,
        });
        if (res.status === 200) {
          setCity(res.body);
          resolve(res.body);
        }
      });
    });
  } else {
    //如果又 直接返回
    // return new Promise((resolve, reject) => {
    //   resolve(curCity);
    // });
    //简化语法
    return Promise.resolve(curCity);
  }
 // eslint-disable-next-line
  return { value: "上海", id: "asdasd" };
};
export default getCurrentCity;
