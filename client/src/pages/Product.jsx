import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import SingleProduct from "../components/cards/SingleProduct";
import { getProduct, getRelated, productStar } from "../functions/product";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );

      existingRatingObject && setStar(existingRatingObject.star);
    }
  });

  const loadSingleProduct = () => {
    return getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        // load related product
        getRelated(res.data._id).then((res) => setRelated(res.data));
      })
      .catch((err) => console.log(err));
  };

  const onStarClick = (newRating, name) => {
    // console.log(newRating, name);
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      console.log("rating clicked", res.data);
      loadSingleProduct();
    });
  };
  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>

      <div className="row">
        <div className="col text-center py-5">
          <hr />
          <h4>Related Product</h4>
          <hr />
        </div>
      </div>

      <div className="row pb-5">
        {related.length
          ? related.map((r) => (
              <div key={r._id} className="col-md-4">
                <ProductCard product={r} />
              </div>
            ))
          : "No Product Found"}
      </div>
    </div>
  );
};

export default Product;
