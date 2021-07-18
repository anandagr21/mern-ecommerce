import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { getCategories } from "../../../functions/category";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { getSub, updateSub } from "../../../functions/sub";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const SubUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); //list of category to show in options
  const [parent, setParent] = useState(""); // parent category

  useEffect(() => {
    loadCategories();
    loadSub();
  }, []);

  const loadCategories = async () => {
    return getCategories().then((c) => {
      setCategories(c.data);
    });
  };

  const loadSub = async () => {
    return getSub(match.params.slug).then((s) => {
      setName(s.data.name);
      setParent(s.data.parent);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateSub(match.params.slug, { name, parent: parent }, user.token)
      .then((res) => {
        // console.log("res", res);
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} updated`);
        history.push("/admin/sub");
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Update sub category</h4>
          <Spin spinning={loading}>
            <div className="form-group">
              <label>Parent Category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setParent(e.target.value)}
              >
                <option>Please Select</option>
                {categories.length > 0 &&
                  categories.map((c) => {
                    return (
                      <option
                        key={c._id}
                        value={c._id}
                        selected={c._id === parent}
                      >
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

          <hr />
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
