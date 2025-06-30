import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { useTable } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  apiRoleError,
  apiRoleSuccess,
} from "../redux/actions";
import CreateRoleModal from "./CreateRoleModal";
import UpdateRoleModal from "./UpdateRoleModal";
import * as Yup from "yup";
import Swal from "sweetalert2";

// Table column definitions
const columns = [
  { Header: "Role", accessor: "role_name" },
  { Header: "Description", accessor: "role_description" },
];

export default function RolesCard({ t }) {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.Role.roles);
  const roleError = useSelector((state) => state.Role.roleError);
  const roleSuccess = useSelector((state) => state.Role.roleSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Validation schemas
  const validationSchema = Yup.object({
    role_name: Yup.string().required(t("Role name is required")),
    role_description: Yup.string().required(t("Description is required")),
    permissions: Yup.array().min(1, "You must choose at least once."),
  });

  // Fetch roles on mount
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Filter roles by search term
  useEffect(() => {
    setFilteredRoles(
      roles.filter((role) =>
        columns.some((col) => {
          const value = role[col.accessor];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      )
    );
  }, [roles, searchTerm]);

  const tableInstance = useTable({ columns, data: filteredRoles });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const resetMessages = () => {
    dispatch(apiRoleError(null));
    dispatch(apiRoleSuccess(null));
  };

  const handleCreateSubmit = async (values) => {
    const res = await dispatch(createRole(values));
    if (res) {
      setTimeout(() => {
        setCreateModalOpen(false);
        dispatch(fetchRoles());
        resetMessages();
      }, 3000);
    }
  };

  const handleUpdateSubmit = async (values) => {
    const res = await dispatch(updateRole(values));
    if (res) {
      setTimeout(() => {
        setUpdateModalOpen(false);
        dispatch(fetchRoles());
        resetMessages();
      }, 3000);
    }
  };

  const handleDelete = (e, id) => {
    e.preventDefault();

    Swal.fire({
      title: t("Are you sure?"),
      text: t("You will not be able to recover this role!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, keep it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(deleteRole(id));
        if (res) {
          dispatch(fetchRoles());
          resetMessages();
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
            <h5 className="mb-0">{t("Roles")}</h5>

            <div className="d-flex flex-wrap gap-2 w-50">
              <input
                type="text"
                placeholder={t("Search Roles")}
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="btn btn-outline-primary"
              onClick={() => {
                resetMessages();
                setCreateModalOpen(true);
              }}
            >
              {t("Create Role")}
            </button>
          </div>

          <div className="card-body">
            <table
              {...getTableProps()}
              className="table border border-2 table-bordered text-center"
            >
              <thead>
                {headerGroups?.map((headerGroup) => {
                  const { key, ...rest } = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...rest}>
                      {headerGroup.headers?.map((column) => {
                        const { key: colKey, ...colProps } =
                          column.getHeaderProps();
                        return (
                          <th key={colKey} {...colProps}>
                            {column.render("Header")}
                          </th>
                        );
                      })}
                      <th>{t("Actions")}</th>
                    </tr>
                  );
                })}
              </thead>

              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="text-break"
                          key={cell.column.id}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setSelectedRole(row.original);
                              resetMessages();
                              setUpdateModalOpen(true);
                            }}
                          >
                            {t("Edit")}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => handleDelete(e, row.original.id)}
                          >
                            {t("Delete")}
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
      </Col>

      <Col xxl={1}></Col>

      {/* Create Modal */}
      <CreateRoleModal
        modal={createModalOpen}
        toggleModal={() => {
          setCreateModalOpen(!createModalOpen);
          resetMessages();
        }}
        parentProps={{ t, error: roleError, success: roleSuccess }}
        validationSchema={validationSchema}
        handleSubmit={handleCreateSubmit}
      />

      {/* Update Modal */}
      <UpdateRoleModal
        modal={updateModalOpen}
        toggleModal={() => {
          setUpdateModalOpen(!updateModalOpen);
          resetMessages();
        }}
        parentProps={{ t, error: roleError, success: roleSuccess }}
        validationSchema={validationSchema}
        handleSubmit={handleUpdateSubmit}
        selectedRole={selectedRole}
      />
    </div>
  );
}
