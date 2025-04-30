export const roleNameFinder = (roleList, roleId) => {
    const role = roleList.find((role) => role.id === roleId);
    return role ? role.role_name : '';
}
