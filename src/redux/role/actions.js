import {
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  FETCH_ROLES,
  FETCH_ROLE_PERMISSIONS,
  API_PERMISSION_ERROR,
  API_PERMISSION_SUCCESS,
  API_ROLE_ERROR,
  API_ROLE_SUCCESS,
  FETCH_PERMISSIONS,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  FETCH_PERMISSIONS_BY_ROLE_ID,
  ROLES,
  ROLE_PERMISSIONS,
  PERMISSIONS,
} from "./constants";

export const createRoleAction = (role) => ({
  type: CREATE_ROLE,
  payload: role,
});

export const updateRoleAction = (role) => ({
  type: UPDATE_ROLE,
  payload: role,
});

export const deleteRoleAction = (roleId) => ({
  type: DELETE_ROLE,
  payload: roleId,
});

export const fetchRolesAction = (roles) => ({
  type: FETCH_ROLES,
  payload: roles,
});

export const fetchRolePermissionsAction = (permissions) => ({
  type: FETCH_ROLE_PERMISSIONS,
  payload: permissions,
});

export const apiPermissionError = (error) => ({
  type: API_PERMISSION_ERROR,
  payload: error,
});

export const apiPermissionSuccess = (success) => ({
  type: API_PERMISSION_SUCCESS,
  payload: success,
});

export const apiRoleError = (error) => ({
  type: API_ROLE_ERROR,
  payload: error,
});

export const apiRoleSuccess = (success) => ({
  type: API_ROLE_SUCCESS,
  payload: success,
});

export const fetchPermissionsAction = (permissions) => ({
  type: FETCH_PERMISSIONS,
  payload: permissions,
});

export const createPermissionAction = (permission) => ({
  type: CREATE_PERMISSION,
  payload: permission,
});

export const updatePermissionAction = (permission) => ({
  type: UPDATE_PERMISSION,
  payload: permission,
});

export const deletePermissionAction = (permissionId) => ({
  type: DELETE_PERMISSION,
  payload: permissionId,
});

export const fetchPermissionsByRoleIdAction = (permission) => ({
  type: FETCH_PERMISSIONS_BY_ROLE_ID,
  payload: permission,
});

export const fetchRoles = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/roles`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();

      if (response?.status !== 200) {
        throw data;
      }
      dispatch(fetchRolesAction(data?.roles));
      dispatch(apiRoleSuccess("Roles fetched successfully"));
      return data?.roles;
    } catch (error) {
      dispatch(apiRoleError(error.error));
    }
  };
};

export const createRole = (role) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
          body: JSON.stringify(role),
        }
      );
      const data = await response.json();

      if (response?.status !== 201) {
        throw data;
      }
      dispatch(createRoleAction(data?.role));
      dispatch(apiRoleSuccess("Role created successfully"));
      return data?.role;
    } catch (error) {
      dispatch(apiRoleError(error.error));
    }
  };
};

export const updateRole = (role) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/roles/${role.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
          body: JSON.stringify(role),
        }
      );
      const data = await response.json();

      if (response?.status !== 200) {
        throw data;
      }
      dispatch(updateRoleAction(data?.role));
      dispatch(apiRoleSuccess("Role updated successfully"));
      return data?.role;
    } catch (error) {
      dispatch(apiRoleError(error.error));
    }
  };
};

export const deleteRole = (roleId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/roles/${roleId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();

      if (response?.status !== 200) {
        throw data;
      }
      dispatch(deleteRoleAction(roleId));
      dispatch(apiRoleSuccess("Role deleted successfully"));
      return data;
    } catch (error) {
      dispatch(apiRoleError(error.error));
    }
  };
};

export const fetchPermissionsByRoleId = (roleId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/permissions/${roleId}`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();

      if (response?.status !== 200) {
        throw data;
      }
      dispatch(fetchPermissionsByRoleIdAction(data?.permission));
      dispatch(apiPermissionSuccess("Permission fetched successfully"));
      return data?.permission;
    } catch (error) {
      dispatch(apiPermissionError(error.error));
    }
  };
};

export const fetchPermissionList = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/permissions`,
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
            Host: `${process.env.REACT_APP_API_URL}`,
            "ngrok-skip-browser-warning": 69420,
          },
        }
      );
      const data = await response.json();

      if (response?.status !== 200) {
        throw data;
      }
      dispatch(fetchPermissionsAction(data?.permissions));
      dispatch(apiPermissionSuccess("Permissions fetched successfully"));
      return data?.permissions;
    } catch (error) {
      dispatch(apiPermissionError(error.error));
    }
  };
};

// export const hasPermission = (roleId, permission) => {
//   console.log("lkdjskfdskfds", roleId, permission);
//   const role = ROLES[roleId]; // Map roleId to role name
//   return (
//     ROLE_PERMISSIONS[role]?.includes(permission) ||
//     ROLE_PERMISSIONS[role]?.includes(PERMISSIONS.VIEW_ALL_COMPONENTS)
//   );
// };

export const hasPermission = (permissions, permissionToCheck) => {
  if (!Array.isArray(permissions)) {
    console.warn("Permissions is not an array:", permissions);
    return false;
  }

  if (!permissionToCheck) {
    console.warn("Permission to check is not provided");
    return false;
  }

  // Eğer dizi ise, en az bir izin eşleşiyor mu diye kontrol et
  if (Array.isArray(permissionToCheck)) {
    return permissionToCheck.some((perm) => permissions.includes(perm));
  }

  // String ise direkt kontrol et
  if (typeof permissionToCheck === "string") {
    return permissions.includes(permissionToCheck);
  }

  console.warn(
    "Permission to check is not a string or array:",
    permissionToCheck
  );
  return false;
};
