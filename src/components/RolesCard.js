import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { useTable } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRoles,
  createRole,
  apiRoleError,
  apiRoleSuccess,
  updateRole,
  deleteRole,
} from "../redux/actions";
import CreateRoleModal from "./CreateRoleModal";
import UpdateRoleModal from "./UpdateRoleModal";
import * as Yup from "yup";
import Swal from "sweetalert2";

const columns = [
  {
    Header: "ID",
    accessor: "id", // accessor is the "key" in the data
  },
  {
    Header: "Role",
    accessor: "role_name",
  },
  {
    Header: "Description",
    accessor: "role_description",
  },
];

export default function RolesCard(props) {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.Role.roles); // Original data

  const userInfo =
    localStorage.getItem("authUser") &&
    JSON.parse(localStorage.getItem("authUser"));

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState(roles);
  const [createRoleModal, setCreateRoleModal] = useState(false);
  const [updateRoleModal, setUpdateRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const roleError = useSelector((state) => state.Role.roleError);
  const roleSuccess = useSelector((state) => state.Role.roleSuccess);

  const createValidationSchema = Yup.object().shape({
    role_name: Yup.string().required(props.t("Role name is required")),
    role_description: Yup.string().required(props.t("Description is required")),
  });

  const updateValidationSchema = Yup.object().shape({
    role_name: Yup.string().required(props.t("Role name is required")),
    role_description: Yup.string().required(props.t("Description is required")),
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    const filteredData = roles.filter((role) =>
      columns.some((column) => {
        const value = role[column.accessor];
        // Ensure both value and search term are treated as strings for comparison
        return (
          value !== undefined &&
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
    setFilteredRoles(filteredData);
  }, [searchTerm, roles]);

  const tableInstance = useTable({ columns, data: filteredRoles });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleCreateSubmit = async (values) => {
    await dispatch(createRole(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setCreateRoleModal(false);
          dispatch(fetchRoles());
          dispatch(apiRoleError(null));
          dispatch(apiRoleSuccess(null));
        }, 3000);
      }
    });
  };

  const handleUpdateSubmit = async (values) => {
    await dispatch(updateRole(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setUpdateRoleModal(false);
          dispatch(fetchRoles());
          dispatch(apiRoleError(null));
          dispatch(apiRoleSuccess(null));
        }, 3000);
      }
    });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    // Display confirmation dialog
    Swal.fire({
      title: props.t("Are you sure?"),
      text: props.t("You will not be able to recover this role!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: props.t("Yes, delete it!"),
      cancelButtonText: props.t("No, keep it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteRole(id));
          if (response) {
            dispatch(fetchRoles());
            dispatch(apiRoleError(null));
            dispatch(apiRoleSuccess(null));
          }
        } catch (error) {
          console.error("Error deleting role:", error);
        }
      }
    });
  };

  return (
    <div className="d-flex justify-content-center">
      <>
        <Col xxl={1}></Col>
        <Col xs={12} xl={12} xxl={12} className="container mt-4 ms-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{props.t("Roles")}</h5>
              <div className="d-flex flex-wrap gap-2 w-50">
                <input
                  placeholder={props.t("Search Roles")}
                  type="text"
                  className="form-control"
                  id="role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    dispatch(apiRoleError(null));
                    dispatch(apiRoleSuccess(null));
                    setCreateRoleModal(true);
                  }}
                >
                  {props.t("Create Role")}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-4">
                {/* Roles Table Section */}
                <table
                  className="table border border-2 table-bordered text-center"
                  {...getTableProps()}
                >
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>
                            {column.render("Header")}
                          </th>
                        ))}
                        <th>{props.t("Actions")}</th>
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td className="text-break" {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          ))}
                          <td>
                            {/* button group for edit and delete */}
                            <div className="btn-group">
                              {/*<button className="btn btn-dark">
                                                                {t('Users')}
                                                            </button>*/}
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  setSelectedRole(row.original);
                                  dispatch(apiRoleError(null));
                                  dispatch(apiRoleSuccess(null));
                                  setUpdateRoleModal(true);
                                }}
                              >
                                {props.t("Edit")}
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={(e) => {
                                  handleDelete(e, row.original.id);
                                }}
                              >
                                {props.t("Delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={1}></Col>
        <CreateRoleModal
          modal={createRoleModal}
          toggleModal={() => {
            setCreateRoleModal(!createRoleModal);
            dispatch(apiRoleError(null));
            dispatch(apiRoleSuccess(null));
          }}
          parentProps={{
            t: props.t,
            error: roleError,
            success: roleSuccess,
          }}
          validationSchema={createValidationSchema}
          handleSubmit={handleCreateSubmit}
        />
        <UpdateRoleModal
          modal={updateRoleModal}
          toggleModal={() => {
            setUpdateRoleModal(!updateRoleModal);
            dispatch(apiRoleError(null));
            dispatch(apiRoleSuccess(null));
          }}
          parentProps={{
            t: props.t,
            error: roleError,
            success: roleSuccess,
          }}
          validationSchema={updateValidationSchema}
          handleSubmit={handleUpdateSubmit}
          selectedRole={selectedRole}
        />
      </>
    </div>
  );
}
