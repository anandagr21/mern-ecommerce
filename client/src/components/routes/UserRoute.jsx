import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  console.log("user route", user);

  return user && user.token ? <Route {...rest} /> : <LoadingToRedirect />;
};
export default UserRoute;
