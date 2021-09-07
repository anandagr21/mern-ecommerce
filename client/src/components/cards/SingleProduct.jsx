import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import DefaultImage from "../../images/image.jpg";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

const { TabPane } = Tabs;

// this is child component of product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
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
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((image) => (
                <img src={image.url} alt="img" key={image.public_id} />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img src={DefaultImage} alt="img" className="card-image" />}
          ></Card>
        )}

        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>

          <TabPane tab="More" key="2">
            Call us on -
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>

        {product && product.ratings && product.ratings.length > 0
          ? showAverage(product)
          : null}

        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" />
              <br />
              <Tooltip title={tooltip}>
                <a onClick={handleAddToCart}>Add to Cart</a>
              </Tooltip>
            </>,
            <Link to="/">
              <HeartOutlined className="text-info" /> <br />
              Add to wishlist
            </Link>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
