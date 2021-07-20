import { Redirect } from "react-router-dom";

import Home from "../pages/Home/Home";
import CityList from "../pages/CityList/CityList";
import App from "../App";
import FindHouse from "../pages/FindHouse/FindHouse";
import News from "../pages/News/News";
import Profile from "../pages/Profile/Profile";
import Search from "../pages/Search/Search";
import Map from "../pages/Map/Map";
const routes = [
  {
    path: "/",
    component: App,
    children: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/home"} />,
      },
      //首页
      {
        path: "/home",
        component: Home,
      },
      {
        path: "/citylist",
        component: CityList,
      },
      // 找房
      {
        path: "/findhouse",
        component: FindHouse,
      },
      // 资讯
      {
        path: "/news",
        component: News,
      },
      // 我的
      {
        path: "/profile",
        component: Profile,
      },
      //搜索
      {
        path: "/search",
        component: Search,
      },
      //地图
      {
        path: "/map",
        component: Map,
      },
    ],
  },
];

export default routes;
