import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { getCategories } from "../../../functions/category";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { createSub, getSubs, removeSub } from "../../../functions/sub";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); //list of category to show in options
  const [category, setCategory] = useState(""); // parent category
  const [subs, setSubs] = useState([]); // parent category

  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = async () => {
    return getCategories().then((c) => {
      setCategories(c.data);
    });
  };

  const loadSubs = async () => {
    return getSubs().then((c) => {
      setSubs(c.data);
    });
  };

  const handleRemoveCategory = async (slug) => {
    if (window.confirm("Are you sure you want to remove")) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          toast.warning(`${res.data.name} deleted`);
          loadSubs();
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
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        // console.log("res", res);
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} created`);
        loadSubs();
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
          <h4>Create sub category</h4>
          <Spin spinning={loading}>
            <div className="form-group">
              <label>Parent Category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Please Select</option>
                {categories.length > 0 &&
                  categories.map((c) => {
                    return (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    );
                  })}
              </select>
            </div>

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
          {subs.filter(searched(keyword)).map((s) => (
            <div className="alert alert-secondary" key={s._id}>
              {s.name}
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemoveCategory(s.slug)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/sub/${s.slug}`}>
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

export default SubCreate;
