import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    return getCategories().then((c) => {
      setCategories(c.data);
    });
  };

  const handleRemoveCategory = async (slug) => {
    if (window.confirm("Are you sure you want to remove")) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((res) => {
          toast.warning(`${res.data.name} deleted`);
          loadCategories();
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toast.error(err.response.data);
            setLoading(false);
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        // console.log("res", res);
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} created`);
        loadCategories();
      })
      .catch((err) => {
        console.log("err", err);
        console.log("err", err.response);
        setLoading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  // step 4
  // const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
  const searched = (keyword) => {
    return (c) => c.name.toLowerCase().includes(keyword);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Create category</h4>
          <Spin spinning={loading}>
            <CategoryForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />
          </Spin>

          {/* step 2 and step 3*/}
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          <hr />
          {/* step 5 */}
          {categories.filter(searched(keyword)).map((c) => (
            <div className="alert alert-secondary" key={c._id}>
              {c.name}
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemoveCategory(c.slug)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
