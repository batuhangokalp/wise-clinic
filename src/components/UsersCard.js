import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { useTable, usePagination } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, apiUserSuccess, apiUserError } from "../redux/actions";
import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { deleteUser, createUser, updateUser } from "../redux/actions";
import * as Yup from "yup";
import Swal from "sweetalert2";

const columns = [
  { Header: "Name", accessor: "name" },
  { Header: "Surname", accessor: "surname" },
  { Header: "Position", accessor: "position_name" },
  { Header: "Department", accessor: "department_name" },
  { Header: "Role", accessor: "role_name" },
  { Header: "Active", accessor: "is_active" },
];

function UsersCard(props) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.User?.users);
  const roles = useSelector((state) => state.Role.roles);
  const userError = useSelector((state) => state.User.error);
  const userSuccess = useSelector((state) => state.User.success);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const createValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    email: Yup.string().required("Email is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    password: Yup.string().required("Password is required"),
    role_id: Yup.number().required("Role is required"),
    language_id: Yup.number().nullable(),
    sex: Yup.string().nullable(),
    birth_date: Yup.string().nullable(),
    position: Yup.string().nullable(),
    department: Yup.string().nullable(),
    is_active: Yup.string().nullable(),
  });

  const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    email: Yup.string().required("Email is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    password: Yup.string().nullable(),
    role_id: Yup.number().required("Role is required"),
    language_id: Yup.number().nullable(),
    sex: Yup.string().nullable(),
    birth_date: Yup.string().nullable(),
    position: Yup.string().nullable(),
    department: Yup.string().nullable(),
    is_active: Yup.string().nullable(),
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const usersWithRoles = users?.map((user) => {
      const userRole = roles.find((role) => role.id === user.role_id);
      return {
        ...user,
        role_name: userRole ? userRole?.role_name : "",
        is_active: user.is_active === "Y" ? props.t("Yes") : props.t("No"),
      };
    });

    const filteredData = usersWithRoles.filter((user) =>
      columns.some((column) => {
        const value = user[column.accessor];
        return (
          value !== undefined &&
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );

    setFilteredUsers(filteredData);
  }, [searchTerm, users, roles]);

  const tableInstance = useTable(
    {
      columns,
      data: filteredUsers,
      initialState: { pageIndex: 0, pageSize: 10 }, // Default page settings
    },
    usePagination // Enable pagination plugin
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Only the rows for the current page
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state: { pageIndex },
  } = tableInstance;

  const handleCreateSubmit = async (values) => {
    values["is_active"] = values.is_active ? "Y" : "N";
    await dispatch(createUser(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setCreateUserModal(false);
          dispatch(fetchUsers());
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }, 3000);
      }
    });
  };

  const handleUpdateSubmit = async (values) => {
    values["is_active"] = values.is_active ? "Y" : "N";
    // Only send the password if it's not empty or null
    if (!values.password) {
      delete values.password; // Remove the password field from the values object
    }
    await dispatch(updateUser(values)).then((response) => {
      if (response) {
        setTimeout(async () => {
          setUpdateUserModal(false);
          dispatch(fetchUsers());
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }, 3000);
      }
    });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    // Display confirmation dialog
    Swal.fire({
      title: props.t("Are you sure?"),
      text: props.t("You will not be able to recover this user!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: props.t("Yes, delete it!"),
      cancelButtonText: props.t("No, keep it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteUser(id));
          if (response) {
            dispatch(fetchUsers());
            dispatch(apiUserError(null));
            dispatch(apiUserSuccess(null));
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    });
  };

  return (
    <div className="d-flex justify-content-center">
      <Col xxl={1}></Col>
      <Col xs={12} xl={12} xxl={12} className="container mt-4 ms-4">
        <div className="card shadow-sm">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{props.t("Users")}</h5>
            <div className="d-flex flex-wrap gap-2 w-50">
              <input
                placeholder={props.t("Search Users")}
                type="text"
                className="form-control"
                id="user"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  dispatch(apiUserError(null));
                  dispatch(apiUserSuccess(null));
                  setCreateUserModal(true);
                }}
              >
                {props.t("Create User")}
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
                  {headerGroups.map((headerGroup) => {
                    const { key: headerKey, ...headerProps } =
                      headerGroup.getHeaderGroupProps();
                    return (
                      <tr key={headerKey} {...headerProps}>
                        {headerGroup.headers.map((column) => {
                          const { key: colKey, ...colProps } =
                            column.getHeaderProps();
                          return (
                            <th key={colKey} {...colProps}>
                              {column.render("Header")}
                            </th>
                          );
                        })}
                        <th>{props.t("Actions")}</th>
                      </tr>
                    );
                  })}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    const { key: rowKey, ...rowProps } = row.getRowProps();
                    return (
                      <tr key={rowKey} {...rowProps}>
                        {row.cells.map((cell) => {
                          const { key: cellKey, ...cellProps } =
                            cell.getCellProps();
                          return (
                            <td
                              key={cellKey}
                              className="text-break"
                              {...cellProps}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedUser(row.original);
                                dispatch(apiUserError(null));
                                dispatch(apiUserSuccess(null));
                                setUpdateUserModal(true);
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
            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                {props.t("Previous")}
              </button>
              <span>
                {props.t("Page")} {pageIndex + 1} {props.t("of")}{" "}
                {pageOptions.length}
              </span>
              <button
                className="btn btn-outline-secondary"
                onClick={nextPage}
                disabled={!canNextPage}
              >
                {props.t("Next")}
              </button>
            </div>
          </div>
        </div>
      </Col>
      <Col xxl={1}></Col>
      <CreateUserModal
        modal={createUserModal}
        toggleModal={() => {
          setCreateUserModal(!createUserModal);
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }}
        parentProps={{
          t: props.t,
          error: userError,
          success: userSuccess,
        }}
        validationSchema={createValidationSchema}
        handleSubmit={handleCreateSubmit}
      />
      <UpdateUserModal
        modal={updateUserModal}
        toggleModal={() => {
          setUpdateUserModal(!updateUserModal);
          dispatch(apiUserError(null));
          dispatch(apiUserSuccess(null));
        }}
        parentProps={{
          t: props.t,
          error: userError,
          success: userSuccess,
        }}
        validationSchema={updateValidationSchema}
        handleSubmit={handleUpdateSubmit}
        selectedUser={selectedUser}
      />
    </div>
  );
}
export default UsersCard;
