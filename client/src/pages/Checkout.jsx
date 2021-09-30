import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { emptyUserCart, getUserCart, saveUserAddress } from "../functions/user";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

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
    });
  };

  return (
    <div className="row container-fluid">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
        <hr />
        <h4>Got Coupon?</h4>
        coupon input and apply button
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {products.map((p, i) => (
          <div key={i}>
            <p>
              ({p.color}) x {p.count}
            </p>
          </div>
        ))}
        <hr />
        <p>Cart Total : {total}</p>

        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary" disabled={!addressSaved}>
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
