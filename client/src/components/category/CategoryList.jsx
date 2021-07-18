import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category";
import { Spin } from "antd";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((c) => {
        setCategories(c.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const showCategories = () => {
    return categories.map((c) => (
      <Link className="col" to={`/category/${c.slug}`}>
        <div
          className="btn btn-btn-outline-primary btn-lg btn-block btn-raised m-3"
          key={c._id}
        >
          {c.name}
        </div>
      </Link>
    ));
  };

  return (
    <div className="container">
      <Spin spinning={loading}>
        <div className="row">{showCategories()}</div>
      </Spin>
    </div>
  );
};

export default CategoryList;
