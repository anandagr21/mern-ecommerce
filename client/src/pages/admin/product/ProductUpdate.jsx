import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { Spin } from "antd";
import { toast } from "react-toastify";
import { getProduct, updateProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
  quantity: "",
};

const ProductUpdate = ({ match, history }) => {
  // state
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [arrayOfSubsIds, setArrayOfSubsIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  // router
  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(slug)
      .then((p) => {
        console.log("single product", p);
        // 1. load single product
        setValues({ ...values, ...p.data });

        // 2. load single product category subs
        getCategorySubs(p.data.category._id).then((res) => {
          setSubOptions(res.data);
        });

        // 3. prepare array of sub ids to show as default subs values in ANT Design select
        let arr = [];
        p.data.subs.map((s) => {
          return arr.push(s._id);
        });

        setArrayOfSubsIds((prev) => arr); // required for antd select to work
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadCategories = async () => {
    return getCategories().then((c) => {
      setCategories(c.data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.subs = arrayOfSubsIds;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is updated successfully`);
        history.push("/admin/product");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [] });

    setSelectedCategory(e.target.value);

    console.log("category change", values.category);
    getCategorySubs(e.target.value).then((res) => {
      console.log("category subs ", res);
      setSubOptions(res.data);
    });
    if (values.category._id === e.target.value) {
      loadProduct();
    }
    setArrayOfSubsIds([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h4>Product update</h4>
          {/* {JSON.stringify(values)} */}
          <hr />

          <Spin spinning={imageLoading}>
            <div className="p-3">
              <FileUpload
                values={values}
                setValues={setValues}
                setImageLoading={setImageLoading}
              />
            </div>
          </Spin>

          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            values={values}
            setValues={setValues}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubsIds}
            setArrayOfSubs={setArrayOfSubsIds}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
