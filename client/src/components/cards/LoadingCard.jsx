import { Skeleton } from "antd";
import React from "react";

const LoadingCard = ({ loading, children }) => {
  return (
    <Skeleton loading={loading} active>
      {children}
    </Skeleton>
  );
};

export default LoadingCard;
