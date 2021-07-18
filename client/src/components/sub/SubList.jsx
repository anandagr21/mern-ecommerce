import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";
import { Spin } from "antd";

const SubList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs()
      .then((c) => {
        setSubs(c.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const showSubs = () => {
    return subs.map((s) => (
      <Link className="col" to={`/sub/${s.slug}`}>
        <div
          className="btn btn-btn-outline-primary btn-lg btn-block btn-raised m-3"
          key={s._id}
        >
          {s.name}
        </div>
      </Link>
    ));
  };

  return (
    <div className="container">
      <Spin spinning={loading}>
        <div className="row">{showSubs()}</div>
      </Spin>
    </div>
  );
};

export default SubList;
