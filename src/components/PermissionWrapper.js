import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, hasPermission } from "../redux/actions";
import { PERMISSION_MAP } from "../redux/role/constants";
import { useEffect } from "react";

const PermissionWrapper = (WrappedComponent, requiredPermissions) => {
  const WithPermission = (props) => {
    const dispatch = useDispatch();
    const roleId = useSelector((state) => state.User.user?.role_id);
    const roles = useSelector((state) => state.Role.roles);

    const currentRole = roles.find((role) => role.id === roleId);
    useEffect(() => {
      dispatch(fetchRoles());
    }, []);
    if (!currentRole) {
      return <div>Loading permissions...</div>;
    }

    const rawPermissions = currentRole.permissions || [];
    const userPermissions = rawPermissions
      .flatMap((p) => PERMISSION_MAP[p] || [])
      .filter(Boolean);

    const isAuthorized = hasPermission(userPermissions, requiredPermissions);

    if (!isAuthorized) {
      return <div>Unauthorized</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithPermission;
};

export default PermissionWrapper;
