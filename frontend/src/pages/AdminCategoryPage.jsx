import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllCategory from '../components/Admin/AllCategories'

const AdminDashboardProducts = () => {
  return (
    <div>
    <AdminHeader />
    <div className="w-full flex bg-white">
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={5} />
        </div>
        <AllCategory />
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardProducts