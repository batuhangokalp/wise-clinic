import React from 'react'

export default function PermissionsCard() {
  return (
    <div className="container mt-4 ms-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Access Permissions</h5>
                    </div>
                    <div className="card-body">
                        {/* Roles Section */}
                        <div className="mb-4">
                            <h6>Roles</h6>
                            <div className="d-flex flex-wrap gap-2">
                                <button className="btn btn-outline-primary">Create Role</button>
                                <button className="btn btn-outline-secondary">Clone Role</button>
                                <div className="btn-group">
                                    <button className="btn btn-primary">Online Store Administrators</button>
                                    <button className="btn btn-secondary">Online Store Staff</button>
                                    <button className="btn btn-light">Warehouse Clerk</button>
                                    <button className="btn btn-light">Role Name</button>
                                </div>
                            </div>
                        </div>

                        {/* Employees Section */}
                        <div className="mb-4">
                            <h6>Employees and Departments</h6>
                            <div className="d-flex">
                                <div className="badge bg-primary rounded-circle me-2">A</div>
                                <div className="badge bg-primary rounded-circle me-2">B</div>
                                <button className="btn btn-outline-primary btn-sm">+</button>
                            </div>
                        </div>

                        {/* Product Catalog Section */}
                        <div>
                            <h6>Product Catalog</h6>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Permission</th>
                                        <th>Role 1</th>
                                        <th>Role 2</th>
                                        <th>Role 3</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>View Product Catalog</td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" defaultChecked />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" defaultChecked />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Create Product</td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" defaultChecked />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Edit Product</td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Delete Product</td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                        <td>
                                            <input type="checkbox" className="form-check-input" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
  )
}
