import React from 'react';
import CreatePost from "../../components/Shop/CreatePost";
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';

const ShopCreatePosts = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex items-center justify-between w-full bg-white">
      <div className="w-[330px]">
        <DashboardSideBar active={6} />
      </div>
      <div className="w-full justify-center flex">
        <CreatePost />
      </div>
    </div>
    </div>
  )
}

export default ShopCreatePosts