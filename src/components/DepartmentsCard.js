import React, { useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import { useTable } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, createDepartment, apiUserError, apiUserSuccess, updateDepartment, deleteDepartment } from '../redux/actions';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import CreateDepartmentModal from './CreateDepartmentModal';
import UpdateDepartmentModal from './UpdateDepartmentModal';


const columns = [
    {
        Header: 'ID',
        accessor: 'id', // accessor is the "key" in the data
    },
    {
        Header: 'Department',
        accessor: 'name',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
];

export default function DepartmentsCard(props) {
    const dispatch = useDispatch();
    const departments = useSelector((state) => state.User.departments); // Original data


    // State for search input
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState(departments);
    const [createDepartmentModal, setCreateDepartmentModal] = useState(false);
    const [updateDepartmentModal, setUpdateDepartmentModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const error = useSelector((state) => state.User.error);
    const success = useSelector((state) => state.User.success);


    const createValidationSchema = Yup.object().shape({
        name: Yup.string().required(props.t('Department name is required')),
        description: Yup.string().required(props.t('Description is required')),
    });

    const updateValidationSchema = Yup.object().shape({
        name: Yup.string().required(props.t('Department name is required')),
        description: Yup.string().required(props.t('Description is required')),
    });


    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        const filteredData = departments.filter((department) =>
            columns.some((column) => {
                const value = department[column.accessor];
                // Ensure both value and search term are treated as strings for comparison
                return value !== undefined && value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
        setFilteredDepartments(filteredData);
    }, [searchTerm, departments]);


    const tableInstance = useTable({ columns, data: filteredDepartments });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    const handleCreateSubmit = async (values) => {
        await dispatch(createDepartment(values)).then((response) => {
            if (response) {
                setTimeout(async () => {
                    setCreateDepartmentModal(false);
                    dispatch(fetchDepartments());
                    dispatch(apiUserError(null));
                    dispatch(apiUserSuccess(null));
                }, 3000);
            }
        });
    };

    const handleUpdateSubmit = async (values) => {
        
        await dispatch(updateDepartment(values)).then((response) => {
            if (response) {
                setTimeout(async () => {
                    setUpdateDepartmentModal(false);
                    dispatch(fetchDepartments());
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
            title: props.t('Are you sure?'),
            text: props.t('You will not be able to recover this department!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: props.t('Yes, delete it!'),
            cancelButtonText: props.t('No, keep it'),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await dispatch(deleteDepartment(id));
                    if (response) {
                            dispatch(fetchDepartments());
                            dispatch(apiUserError(null));
                            dispatch(apiUserSuccess(null));
                    }
                } catch (error) {
                    console.error('Error deleting department:', error);
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
                        <h5 className="mb-0">{props.t('Departments')}</h5>
                        <div className="d-flex flex-wrap gap-2 w-50">
                            <input
                                placeholder={props.t('Search Departments')}
                                type="text"
                                className="form-control"
                                id="department"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            <button className="btn btn-outline-primary"
                                onClick={() => {
                                    dispatch(apiUserError(null));
                                    dispatch(apiUserSuccess(null));
                                    setCreateDepartmentModal(true);
                                }}>
                                {props.t('Create Department')}
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="mb-4">
                            {/* Departments Table Section */}
                            <table
                                className="table border border-2 table-bordered text-center"
                                {...getTableProps()}
                            >
                                <thead>
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th {...column.getHeaderProps()}>
                                                    {column.render('Header')}
                                                </th>
                                            ))}
                                            <th>{props.t('Actions')}</th>
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map((cell) => (
                                                    <td
                                                        className="text-break"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                                <td>
                                                    {/* button group for edit and delete */}
                                                    <div className="btn-group">
                                                        {
                                                            /*<button className="btn btn-dark">
                                                                {t('Users')}
                                                            </button>*/
                                                        }
                                                        <button className="btn btn-primary"
                                                            onClick={() => {
                                                                setSelectedDepartment(row.original);
                                                                dispatch(apiUserError(null));
                                                                dispatch(apiUserSuccess(null));
                                                                setUpdateDepartmentModal(true);
                                                            }}
                                                        >
                                                            {props.t('Edit')}
                                                        </button>
                                                        <button className="btn btn-secondary"
                                                            onClick={(e) => {
                                                                handleDelete(e,row.original.id);
                                                            }
                                                            }>
                                                            {props.t('Delete')}
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
            <CreateDepartmentModal
                modal={createDepartmentModal}
                toggleModal={() => {
                    setCreateDepartmentModal(!createDepartmentModal)
                    dispatch(apiUserError(null));
                    dispatch(apiUserSuccess(null));
                }
                }
                parentProps={{
                    t: props.t,
                    error: error,
                    success: success
                }}
                validationSchema={createValidationSchema}
                handleSubmit={handleCreateSubmit}
            />
            <UpdateDepartmentModal
                modal={updateDepartmentModal}
                toggleModal={() => {
                    setUpdateDepartmentModal(!updateDepartmentModal) 
                    dispatch(apiUserError(null));
                    dispatch(apiUserSuccess(null));
                }}
                parentProps={{
                    t: props.t,
                    error: error,
                    success: success
                }}
                validationSchema={updateValidationSchema}
                handleSubmit={handleUpdateSubmit}
                selectedItem={selectedDepartment}
            />
        </div>
    );
}
