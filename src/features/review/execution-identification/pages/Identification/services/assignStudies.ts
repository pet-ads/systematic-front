import { Dispatch, SetStateAction } from "react";

const assignStudies = (setIsAssignmentAvailable: Dispatch<SetStateAction<boolean>>) => {
    setIsAssignmentAvailable(false);
}

export default assignStudies;
