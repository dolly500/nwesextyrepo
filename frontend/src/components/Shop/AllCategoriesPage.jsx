// Import necessary libraries and components
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteCategory, getAllCategories } from "../../redux/actions/category";
import Loader from "../Layout/Loader";

const AllCategories = () => {
  const { allCategorys, isLoading } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteCategory(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Category Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1.8,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        </>
      ),
    },
  ];

  const row = [];

  allCategorys &&
    allCategorys?.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        description: item.description,
      });
    });

  console.log('category', allCategorys)

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10">
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

export default AllCategories;
