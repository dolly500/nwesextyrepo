import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllQuestionaire,
  deleteQuestionaire,
} from "../../redux/actions/questionaire";
import Loader from "../Layout/Loader";

const AllQuestionaire = () => {
  const [rows, setRows] = useState([]);
  const { questionaires, isLoading } = useSelector(
    (state) => state.questionaire || {}
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQuestionaire());
  }, [dispatch]);

  useEffect(() => {
    if (questionaires) {
      const updatedRows = questionaires.map((item) => ({
        id: item._id,
        religion: item.religion,
        gender: item.gender.join(", "),
        relationshipStatus: item.relationshipStatus.join(", "),
        helpReason: item.helpReason,
        optionsAvailable: item.optionsAvailable.join(", "),
        consultationFee: item.consultationFee,
        therapyType: item.therapyType.join(", "),
      }));
      setRows(updatedRows);
    }
  }, [questionaires]);

  const handleDelete = async (id) => {
    await dispatch(deleteQuestionaire(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Questionaire Id", minWidth: 150, flex: 0.7 },
    { field: "religion", headerName: "Religion", minWidth: 180, flex: 1.4 },
    { field: "gender", headerName: "Gender", minWidth: 100, flex: 0.6 },
    {
      field: "relationshipStatus",
      headerName: "Relationship Status",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "helpReason",
      headerName: "Help Reason",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "optionsAvailable",
      headerName: "Options Available",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "consultationFee",
      headerName: "Consultation Fee",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "therapyType",
      headerName: "Therapy Type",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "Preview",
      headerName: "",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.id;
        return (
          <Link to={`/questionnaire/${d}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "Delete",
      headerName: "",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.row.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10">
          <DataGrid
            rows={rows}
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

export default AllQuestionaire;
