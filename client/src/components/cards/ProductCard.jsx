import { Card, Tooltip } from "antd";
import React, { useState } from "react";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import image from "../../images/image.jpg";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
const { Meta } = Card;

const ProductCard = ({ product }) => {
  // Destructure
  const { images, title, description, slug, price } = product;
  const [tooltip, setTooltip] = useState("Click to add");

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // push new product to cart
      cart.push({ ...product, count: 1 });

      // remove duplicate
      let unique = _.uniqWith(cart, _.isEqual);

      // save to local storage
      // console.log("unique", unique);
      localStorage.setItem("cart", JSON.stringify(unique));

      // show tooltip
      setTooltip("Added");

      // add to redux
      dispatch({ type: "ADD_TO_CART", payload: unique });
    }
  };
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="pt-1 pb-3 text-center">No ratings yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : image}
            alt="img"
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart}>
              <ShoppingCartOutlined className="text-danger" />
              <br /> Add to Cart
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 50)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
