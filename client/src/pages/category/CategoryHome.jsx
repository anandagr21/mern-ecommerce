import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import ProductCard from "../../components/cards/ProductCard";
import { getCategory } from "../../functions/category";

const CategoryHome = ({ match }) => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getCategory(slug).then((res) => {
      console.log(res.data);
      setCategory(res.data.category);
      setProducts(res.data.products);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <Spin spinning={loading}>
        <div className="row">
          <div className="col">
            <h4 className="text-center p-3 my-5 display-4 jumbotron">
              {products.length} Products in "{category.name}" category
            </h4>
          </div>
        </div>

        <div className="row">
          {products.map((p) => (
            <div className="col" key={p._id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default CategoryHome;
