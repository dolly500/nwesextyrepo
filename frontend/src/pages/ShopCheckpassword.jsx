import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminCheckPassword from "../components/Shop/AdminCheckPassword";

const ShopCheckPassword = () => {
  const navigate = useNavigate();
  const { isSeller,isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate('/shop/${seller._id}`');
    }
  }, [isLoading,isSeller])
  return (
    <div>
        <AdminCheckPassword />
    </div>
  )
}

export default ShopCheckPassword