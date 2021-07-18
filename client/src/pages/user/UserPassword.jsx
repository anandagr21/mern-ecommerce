import React, { useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { Spin } from "antd";

const UserPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(password);
    setLoading(true);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        toast.success("Your password has been updated");
        setPassword("");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
        toast.error(err.message);
      });
  };

  const passwordUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="">Your password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            value={password}
            disabled={loading}
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={!password || loading || password.length < 6}
          >
            Submit
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>

        <div className="col">
          <Spin spinning={loading}>
            <h4>Password Update</h4>
            {passwordUpdateForm()}
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default UserPassword;
