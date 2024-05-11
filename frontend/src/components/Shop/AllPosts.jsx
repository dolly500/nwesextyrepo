import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deletePost, getAllPostsShop } from "../../redux/actions/post";
import Loader from "../Layout/Loader";

const AllPosts = () => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPostsShop(JSON.parse(localStorage.getItem("user"))._id));
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deletePost(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Post Id", minWidth: 150, flex: 0.7 },
    {
      field: "title",
      headerName: "Post title",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 100,
      flex: 0.6,
    },

    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/post/${params.id}?isPost=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },

    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number ",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  posts &&
    posts.forEach((item) => {
      row.push({
        id: item._id,
        title: item.title,
        description: item.description,
      });
    });

  console.log("post log", posts);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllPosts;
