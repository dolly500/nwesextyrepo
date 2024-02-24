import React from 'react';
import DashboardMessages from "../../components/Shop/DashboardMessages";
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';

const ShopInboxPage = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-start justify-between w-full bg-white">
      <div className="w-[80px] 800px:w-[330px]">
        <DashboardSideBar active={10} />
      </div>
       <DashboardMessages />
    </div>
  </div>
  )
}

export default ShopInboxPage