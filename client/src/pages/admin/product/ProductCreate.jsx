import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { Spin } from "antd";
import { toast } from "react-toastify";
import { createProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import ProductCreateFrom from "../../../components/forms/ProductCreateFrom";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  categories: [],
  subs: [],
  shipping: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
  quantity: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    return getCategories().then((c) => {
      setValues({ ...values, categories: c.data });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createProduct(values, user.token)
      .then((res) => {
        console.log(res);
        setLoading(false);
        toast.success(`${res.data.title} created`);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value });
    console.log("category change", values.category);
    getCategorySubs(e.target.value).then((res) => {
      console.log("category subs ", res);
      setSubOptions(res.data);
    });
    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h4>Product Create</h4>
          <hr />

          {JSON.stringify(values.images)}

          <Spin spinning={loading || imageLoading}>
            <div className="p-3">
              <FileUpload
                values={values}
                setValues={setValues}
                setImageLoading={setImageLoading}
              />
            </div>

            <ProductCreateFrom
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleCategoryChange={handleCategoryChange}
              values={values}
              setValues={setValues}
              subOptions={subOptions}
              showSub={showSub}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
