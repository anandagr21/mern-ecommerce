import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../functions/user";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    return getWishlist(user.token).then((res) => {
      console.log(res);
      setWishlist(res.data.wishlist);
    });
  };

  const handleRemove = (productId) => {
    return removeWishlist(productId, user.token).then((res) => {
      loadWishlist();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>

        <div className="col">
          <h4>Wishlist</h4>
          {wishlist &&
            wishlist.map((p) => (
              <div key={p._id} className="alert alert-secondary">
                <Link to={`/product/${p.slug}`}>{p.title}</Link>
                <span
                  className="btn btn-sm float-right"
                  onClick={() => handleRemove(p._id)}
                >
                  <DeleteOutlined className="text-danger" />
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserWishlist;
