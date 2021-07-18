import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router";
import { currentAdmin } from "../../functions/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log("CURRENT ADMIN RESPONSE", res);
          setOk(true);
        })
        .catch((err) => {
          console.log("ADMIN ROUTED ERROR", err);
          setOk(false);
        });
    }
  }, [user]);

  return ok ? <Route {...rest} /> : <LoadingToRedirect />;
};
export default AdminRoute;
