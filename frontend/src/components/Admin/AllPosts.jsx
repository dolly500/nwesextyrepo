import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
   axios.get(`${server}/post/admin-all-posts`, {withCredentials: true}).then((res) =>{
    setPosts(res.data.events);
   })
  }, []);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "Post title",
      headerName: "Post title",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "Description",
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
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
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

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllPosts;
