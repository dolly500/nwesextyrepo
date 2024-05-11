import React from 'react';
import AllPosts from '../components/Admin/AllPosts';
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import AdminHeader from '../components/Layout/AdminHeader';

const AdminDashboardPosts = () => {
  return (
    <div>
    <AdminHeader />
    <div className="w-full flex bg-white">
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={6} />
        </div>
        <AllPosts />
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardPosts