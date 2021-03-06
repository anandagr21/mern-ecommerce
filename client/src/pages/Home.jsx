import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import CategoryList from "../components/category/CategoryList";
import BestSellers from "../components/home/BestSellers";
import NewArrivals from "../components/home/NewArrivals";
import SubList from "../components/sub/SubList";

const Home = () => {
  return (
    <>
      <div className="jumbotron text-danger text-center h1 font-weight-bold">
        <Jumbotron text={["Latest Products", "New Arrivals", "Best Sellers"]} />
      </div>

      <h4 className="text-center p-3 my-5 display-4 jumbotron">New Arrivals</h4>
      <NewArrivals />

      <h4 className="text-center p-3 my-5 display-4 jumbotron">Best Sellers</h4>
      <BestSellers />

      <h4 className="text-center p-3 my-5 display-4 jumbotron">Categories</h4>
      <CategoryList />

      <h4 className="text-center p-3 my-5 display-4 jumbotron">
        Sub Categories
      </h4>
      <SubList />
    </>
  );
};

export default Home;
