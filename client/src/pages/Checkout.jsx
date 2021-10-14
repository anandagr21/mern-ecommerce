import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  applyCoupon,
  emptyUserCart,
  getUserCart,
  saveUserAddress,
} from "../functions/user";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");

  // discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getUserCart(user.token)
      .then((res) => {
        console.log("user cart", JSON.stringify(res.data, null, 4));
        setProducts(res.data.products);
        setTotal(res.data.cartTotal);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const saveAddressToDb = () => {
    // console.log(address);
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }

    // remove from redux
    dispatch({ type: "ADD_TO_CART", payload: [] });

    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      toast.success("Cart empty");
      setTotalAfterDiscount(0);
      setCoupon("");
    });
  };

  const showAddress = () => {
    return (
      <>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
      </>
    );
  };

  const showProductSummary = () => {
    return (
      <>
        <p>Products {products.length}</p>
        <hr />
        {products.map((p, i) => (
          <div key={i}>
            <p>
              ({p.color}) x {p.count}
            </p>
          </div>
        ))}
      </>
    );
  };

  const applyDiscountCoupon = () => {
    console.log("coupon", coupon);
    applyCoupon(user.token, coupon).then((res) => {
      console.log("res coupon", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true/false
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }

      // err
      if (res.data.err) {
        setDiscountError(res.data.err);
        // update redux coupon applied true/false
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const showApplyCoupon = () => (
    <>
      <input
        type="text"
        className="form-control"
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
      />
      <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>
        Apply
      </button>
    </>
  );

  return (
    <div className="row container-fluid">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        {showApplyCoupon()}
        <br />
        {discountError && <p className="text-danger p-2">{discountError}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total : {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="text-success p-2">
            Discount Applied: Total payable ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
              onClick={() => history.push("/payment")}
            >
              Place Order
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              onClick={emptyCart}
              disabled={!products.length}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
