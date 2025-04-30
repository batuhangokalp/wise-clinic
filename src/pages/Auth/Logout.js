import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import withRouter from "../../components/withRouter";

//redux store
import { logoutUser } from '../../redux/actions';
import { createSelector } from 'reselect';

/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
  const dispatch = useDispatch();
  localStorage.removeItem("authUser");
  localStorage.removeItem("token");

  useEffect(() => {
    dispatch(logoutUser(props.router.navigate));
  }, [dispatch, props.router.navigate]);

    
    return <Navigate to="/login" />;

}

export default withRouter(connect(null, { logoutUser })(Logout));