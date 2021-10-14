import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import AdminNav from "../../../components/nav/AdminNav";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import {
  createCoupon,
  getCoupons,
  removeCoupon,
} from "../../../functions/coupon";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState("");
  const [coupons, setCoupons] = useState([]);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  const loadAllCoupons = () =>
    getCoupons()
      .then((res) => {
        setCoupons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setLoading(false);
      });

  useEffect(() => {
    setLoading(true);
    loadAllCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table(name, expiry, discount);
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`${res.data.name} created successfully`);
        loadAllCoupons();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
        setLoading(false);
      });
  };

  const handleRemove = async (couponId) => {
    if (window.confirm("Are you sure you want to remove")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          loadAllCoupons();

          toast.error(`"${res.data.name}" removed successfully`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="container-fluid mb-3">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? <h5>Loading</h5> : <h4>Coupon</h4>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <DatePicker
                className="form-control"
                selected={expiry}
                value={expiry}
                onChange={(date) => setExpiry(date)}
                required
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>

          <h4>{coupons.length} Coupons</h4>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}</td>
                  <td>
                    <DeleteOutlined
                      className="text-danger pointer"
                      onClick={() => handleRemove(c._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
