import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllCategoriesPage from "../../components/Shop/AllCategoriesPage"

const ShopAllCategory = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex justify-between w-full bg-white">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSideBar active={5} />
            </div>
            <div className="w-full justify-center flex">
                <AllCategoriesPage />
            </div>
          </div>
    </div>
  )
}

export default ShopAllCategory;