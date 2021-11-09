import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideDrawer from "./components/drawer/SideDrawer";
import Header from "./components/nav/Header";
import AdminRoute from "./components/routes/AdminRoute";
import UserRoute from "./components/routes/UserRoute";
import { auth } from "./firebase";
import { currentUser } from "./functions/auth";

// import AdminDashboard from "./pages/admin/AdminDashboard";
// import CategoryCreate from "./pages/admin/category/CategoryCreate";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
// import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";
// import AllProducts from "./pages/admin/product/AllProducts";
// import ProductCreate from "./pages/admin/product/ProductCreate";
// import ProductUpdate from "./pages/admin/product/ProductUpdate";
// import SubCreate from "./pages/admin/subCategory/SubCreate";
// import SubUpdate from "./pages/admin/subCategory/SubUpdate";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import RegisterComplete from "./pages/auth/RegisterComplete";
// import Cart from "./pages/Cart";
// import CategoryHome from "./pages/category/CategoryHome";
// import Checkout from "./pages/Checkout";
// import Home from "./pages/Home";
// import Payment from "./pages/Payment";
// import Product from "./pages/Product";
// import Shop from "./pages/Shop";
// import SubHome from "./pages/sub/SubHome";
// import UserHistory from "./pages/user/UserHistory";
// import UserPassword from "./pages/user/UserPassword";
// import UserWishlist from "./pages/user/UserWishlist";

// using lazy loading 
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() => import("./pages/admin/category/CategoryCreate"));
const CategoryUpdate = lazy(() => import("./pages/admin/category/CategoryUpdate"));
const CreateCouponPage = lazy(() => import("./pages/admin/coupon/CreateCouponPage"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const SubCreate = lazy(() => import("./pages/admin/subCategory/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/subCategory/SubUpdate"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const Cart = lazy(() => import("./pages/Cart"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Home = lazy(() => import("./pages/Home"));
const Payment = lazy(() => import("./pages/Payment"));
const Product = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Shop"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const UserHistory = lazy(() => import("./pages/user/UserHistory"));
const UserPassword = lazy(() => import("./pages/user/UserPassword"));
const UserWishlist = lazy(() => import("./pages/user/UserWishlist"));


const App = () => {
  const dispatch = useDispatch();

  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
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
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
  return (
    <Suspense fallback={<div className="col text-center p-5">
      __React Redux EC<LoadingOutlined />MMERCE__
    </div>}>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component={UserHistory} />
        <UserRoute exact path="/user/password" component={UserPassword} />
        <UserRoute exact path="/user/wishlist" component={UserWishlist} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute exact path="/admin/sub" component={SubCreate} />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate}
        />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/sub/:slug" component={SubHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <UserRoute exact path="/checkout" component={Checkout} />
        <UserRoute exact path="/payment" component={Payment} />
        <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
      </Switch>
    </Suspense>
  );
};

export default App;
