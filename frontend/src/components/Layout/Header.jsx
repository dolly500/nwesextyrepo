import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../server";
import logo from "../../static/imgs/logo.png";
import styles from "../../styles/styles";
import Wishlist from "../Wishlist/Wishlist";
import Cart from "../cart/Cart";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import Modal from "react-modal";


const Header = ({ activeHeading, data }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false)
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [Messages, setMessages] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  
  console.log("isAuthenticated:", isAuthenticated)
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  const openModal = () => {
    setModalOpen(true);
  };
  
  
  const closeModal = () => {
    setModalOpen(false);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  useEffect(() => {
    axios.get(`${server}/category`, { withCredentials: true })
      .then((res) => {
        setCategories(res.data.categorys);
        console.log('api', res.data.categorys)
      })
      
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);


  const handlePayment = async () => {
    try {
      // Make a request to your server to initiate the payment
      const response = await axios.post('', {
        amount: 5000, // Set your desired amount
        email: '', // Set the customer's email
        metadata: {
          custom_fields: [
            {
              display_name: 'Product Name',
              variable_name: 'product_name',
              value: 'Your Product',
            },
          ],
        },
      });
  
      // After getting the response from the server, redirect to Paystack payment page
      window.location.href = response.data.data.authorization_url;
      
      // Create a conversation and navigate to inbox after payment success
      if (isAuthenticated) {
        const groupTitle = data._id + user._id;
        const userId = user._id;
        const sellerId = data.shop._id;
  
        await axios.post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
      }
      else {
        navigate(`/inbox`);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      // Handle error appropriately (e.g., show an error message to the user)
    }
  };
  

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      openModal();
    } else{
      alert("Please Log In!")
    }
    // else {
    //   // toast.error("Please login to create a conversation");
    //   navigate(`/inbox`)
    //   console.log("data", data)
    //     const groupTitle = data._id + user._id;
    //     const userId = user._id;
    //     const sellerId = data.shop._id;
    //     await axios
    //       .post(`${server}/conversation/create-new-conversation`, {
    //         groupTitle,
    //         userId,
    //         sellerId,
    //       })
    //       .then((res) => {
    //         navigate(`/inbox?${res.data.conversation._id}`);
    //       })
    //       .catch((error) => {
    //         toast.error(error.response.data.message);
    //       });
    // }
  };

  return (
    <>
      <div className={`${styles.section} lg:bg-white lg:h-19 lg:w-300 lg:p-1`} style={{width: '100%'}} >
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div className="">
            <Link to="/">
              <img className="h-auto max-w-full w-2/5 ml-8"
                src= {logo}
                alt=""
              />
            </Link>
          </div>
          {/* search box */}
          <div className="mr-[0] 1200px:mr-[0] 800px:mr-[20px] w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#E6007E] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`}>
                        <div className="w-full flex items-start-py-3">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <div className={`${styles.button} mr-20`} style={{ display: 'none' }}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Go Dashboard" : "Become Seller"}{" "}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#E6007E] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categories={categories}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className={`${styles.noramlFlex}`}>

                <div className="relative cursor-pointer mr-[15px]" onClick={handleMessageSubmit}>
                  <IoChatbubbleEllipses size={30} color="rgb(255 255 255 / 83%)"/>
                </div>

                
<Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Login Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      width: '400px',
      margin: 'auto',
      borderRadius: '8px',
      position: 'relative',
    },
  }}
>
  <div>
    {/* Cancel icon at the right top */}
    <button
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        color: '#333',
      }}
      onClick={closeModal}
    >
      &#10006; {/* Unicode for 'x' symbol */}
    </button>

    <p>Buy Your Talk Time Unit To Access Assigned Therapists</p>

    <br />
    
    {/* Cancel button styling */}
    <button
      style={{
        background: '#ddd',
        color: '#333',
        padding: '8px 16px',
        borderRadius: '4px',
        marginRight: '10px',
        cursor: 'pointer',
      }}
      onClick={closeModal}
    >
      Cancel
    </button>
    
    {/* Pay Here button styling */}
    <button
      style={{
        background: '#483bc1',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={handlePayment}
    >
      Pay Here
    </button>
  </div>
</Modal>

            </div>
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#483bc1] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#483bc1] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div

        className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10 " : null
          }
      w-full h-[70px] bg-[#E6007E] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="h-full w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)} style={{color: 'white'}}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src={logo}
                alt=""
                className="mt-3 cursor-pointer max-w-full h-auto"
                style={{ maxHeight: '150px' }} 
              />
            </Link>
          </div>
          <div className="flex">
            <div className="relative mr-[20px]" onClick={handleMessageSubmit}>
              <IoChatbubbleEllipses size={30} style={{color: 'white'}}/>
            </div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} style={{color: 'white'}} onClick={() => setOpenCart(true)}/>
              <span className="absolute left-0 top-0 rounded-full bg-[#5f3bc1] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* cart popup */}
 
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
          

          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#000000] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" style={{color: 'white'}} />
                    <span className="absolute right-0 top-0 rounded-full bg-[#c13b89] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5" style={{color: 'white'}}
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px relative]">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#E6007E] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i) => {
                      const d = i.name;

                      const Product_name = d.replace(/\s+/g, "-");
                      return (
                        <Link to={`/product/${Product_name}`}>
                          <div className="flex items-center">
                            <img
                              src={i.image_Url[0]?.url}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`} style={{ display: 'none' }}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${user?.avatar?.url}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#1e0eae]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#fff]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#fff]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
