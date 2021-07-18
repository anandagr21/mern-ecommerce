import { Card } from "antd";
import React from "react";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import image from "../../images/image.jpg";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
const { Meta } = Card;

const ProductCard = ({ product }) => {
  // Destructure
  const { images, title, description, slug } = product;
  return (
    <>
      {product && product.ratings && product.ratings.length > 0
        ? showAverage(product)
        : <div className="pt-1 pb-3 text-center">No ratings yet</div>}
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
          <>
            <ShoppingCartOutlined className="text-danger" />
            <br /> Add to Cart
          </>,
        ]}
      >
        <Meta
          title={title}
          description={`${description && description.substring(0, 50)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
