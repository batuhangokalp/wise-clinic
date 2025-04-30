import React from "react";
import { useSelector } from "react-redux";
import { hasPermission } from "../redux/actions"; // Ensure no circular imports

const PermissionWrapper = (WrappedComponent, requiredPermissions) => {
    const WithPermission = (props) => {
        const roleId = useSelector((state) => state.User.user?.role_id);

        // Check if user has any of the required permissions
        const isAuthorized = hasPermission(roleId, requiredPermissions);

        // Hide the component entirely if not authorized
        if (!isAuthorized) {
            return null; // 🔑 Completely hides the component
        }

        return <WrappedComponent {...props} />;
    };

    return WithPermission;
};

export default PermissionWrapper;
