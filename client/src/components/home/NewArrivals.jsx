import React, { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { getProducts, getProductsCount } from "../../functions/product";
import { Pagination } from "antd";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProducts("createdAt", "desc", page)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4" key={product._id}>
              <LoadingCard loading={loading}>
                <ProductCard product={product} />
              </LoadingCard>
            </div>
          ))}
        </div>

        <div className="row">
          <nav className="col-md-4 offset-md-4 text-center p-3 pt-2">
            <Pagination
              current={page}
              total={(productsCount / 3) * 10}
              onChange={(value) => setPage(value)}
            />
          </nav>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;
