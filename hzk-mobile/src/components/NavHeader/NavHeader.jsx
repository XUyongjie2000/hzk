import { NavBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import NavHeaderStyle from "./NavHeader.module.css";
const NavHeader = ({ children, history }) => {
  return (
    <NavBar
      className={NavHeaderStyle.navBar}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => {
        history.go(-1);
      }}
    >
      {children}
    </NavBar>
  );
};

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
};

export default withRouter(NavHeader);
