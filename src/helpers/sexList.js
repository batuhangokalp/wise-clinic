export const sexList = [
    { key: "male", value: "Male" },
    { key: "female", value: "Female" },
    { key: "other", value: "Other" }
]

export const getSexValue = (input) => {
    const sex = sexList?.find(
        (item) => item?.key?.toLowerCase() === input?.toLowerCase() || item?.value?.toLowerCase() === input?.toLowerCase()
    );
    return sex ? sex.value : null;
};
