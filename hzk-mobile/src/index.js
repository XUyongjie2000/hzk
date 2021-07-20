import React from "react";
import ReactDOM from "react-dom";
import "antd-mobile/dist/antd-mobile.css";
import "./assets/fonts/iconfont.css";
// reacr-virtualized的css文件 该文件只需要 在项目入口文件导入一次
import "react-virtualized/styles.css";
import "./index.css";

//配置路由
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "./routes/routes";

ReactDOM.render(
  <HashRouter>
    {/* <React.StrictMode> */}
    {renderRoutes(routes)}
    {/* </React.StrictMode> */}
  </HashRouter>,
  document.getElementById("root")
);