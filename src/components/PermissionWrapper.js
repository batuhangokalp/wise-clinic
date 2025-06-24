import { useSelector } from "react-redux";
import { hasPermission } from "../redux/actions";
import { PERMISSION_MAP } from "../redux/role/constants";

const PermissionWrapper = (WrappedComponent, requiredPermissions) => {
  const WithPermission = (props) => {
    const roleId = useSelector((state) => state.User.user?.role_id);
    const roles = useSelector((state) => state.Role.roles);
    const currentRole = roles.find((role) => role.id === roleId);

    const rawPermissions = currentRole?.permissions || [];
    const userPermissions = rawPermissions
      .flatMap((p) => PERMISSION_MAP[p] || [])
      .filter(Boolean);

    const isAuthorized = hasPermission(userPermissions, requiredPermissions);

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithPermission;
};

export default PermissionWrapper;
