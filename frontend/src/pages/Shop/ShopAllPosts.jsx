import React from 'react';
import AllPosts from "../../components/Shop/AllPosts";
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';

const ShopAllPosts = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSideBar active={5} />
            </div>
            <div className="w-full justify-center flex bg-white">
                <AllPosts />
            </div>
          </div>
    </div>
  )
}

export default ShopAllPosts