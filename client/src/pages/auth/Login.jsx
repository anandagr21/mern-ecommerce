import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { createOrUpdateUser } from "../../functions/auth";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    }else{
      if (user && user.token) {
        history.push("/");
      }
    }
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, [user, history]);

  const roleBasedRedirect = (res) => {
    // check intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          console.log("res", res);
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              email: res.data.email,
              name: res.data.name,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });

          // role based redirect
          roleBasedRedirect(res);
        })
        .catch((error) => {
          console.log(error.message);
        });

      setLoading(false);
      // history.push("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            console.log("res", res);
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                email: res.data.email,
                name: res.data.name,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });

            // role based redirect
            roleBasedRedirect(res);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const LoginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoFocus
        />

        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button
          onClick={handleSubmit}
          type="primary"
          block
          shape="round"
          className="my-3"
          icon={<MailOutlined />}
          size="large"
          disabled={!email || password.length < 6}
        >
          Login with email and password
        </Button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <Spin spinning={loading}>
            <h4>Login</h4>
            {LoginForm()}

            <Button
              onClick={handleGoogleLogin}
              type="danger"
              block
              shape="round"
              icon={<GoogleOutlined />}
              size="large"
            >
              Login with Google
            </Button>

            <Link
              to="/forgot/password"
              className="float-right text-danger mt-3"
            >
              Forgot Password?
            </Link>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Login;
