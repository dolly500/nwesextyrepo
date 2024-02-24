import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import CategoryForm from '../../components/Shop/CategoriesForm'

const ShopCreateCategory = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex items-center justify-between w-full bg-white">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSideBar active={12} />
            </div>
            <div className="w-full justify-center flex">
                <CategoryForm />
            </div>
          </div>
    </div>
  )
}

export default ShopCreateCategory