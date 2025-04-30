import React from 'react'
import { Col } from 'reactstrap';


export default function RoleFilterComponent() {
  return (
    <Col xl={2} className="container mt-4 ms-4">
            <div className="card shadow-sm">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Search Role</h5>
                </div>
                <div className="card-body">
                    <div className="mb-4">
                      <label htmlFor="role">Role</label>
                      <input
                          type="text"
                          className="form-control"
                          id="role"
                      />
                  </div>
                  <div className="mb-4">
                      Search for roles
                  </div>
                  <div className="mb-4">
                      Search for roles
                  </div>
                  <div className="mb-4">
                      Search for roles
                    </div>
                </div>
            </div>
        </Col>
  )
}
