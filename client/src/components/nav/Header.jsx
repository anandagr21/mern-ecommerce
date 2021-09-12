import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import Search from "../forms/Search";
const { SubMenu } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));
  let history = useHistory();

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });

    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home </Link>
      </Menu.Item>

      <Menu.Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop </Link>
      </Menu.Item>

      <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Menu.Item>

      {user && (
        <SubMenu
          key="SubMenu"
          icon={<SettingOutlined />}
          title={user.email?.split("@")[0]}
          className="float-right"
        >
          {user && user.role === "subscriber" && (
            <Menu.Item>
              <Link to="/user/history">Dashboard</Link>
            </Menu.Item>
          )}

          {user && user.role === "admin" && (
            <Menu.Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>
          )}

          <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Menu.Item>
        </SubMenu>
      )}

      {!user && (
        <>
          <Menu.Item
            key="register"
            icon={<UserAddOutlined />}
            className="float-right"
          >
            <Link to="/register">Register</Link>
          </Menu.Item>

          <Menu.Item
            key="login"
            icon={<UserOutlined />}
            className="float-right"
          >
            <Link to="/login">Login</Link>
          </Menu.Item>
        </>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
