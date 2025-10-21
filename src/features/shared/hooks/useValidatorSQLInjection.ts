import useToaster from "@components/feedback/Toaster";
import { hasSQLInjectionChars } from "../utils/helpers/validators/entryValidator";

type SQLInjectionValidator = {
	value: string;
}
export default function useValidatorSQLInjection() {
	const Toaster = useToaster();
	const validator = ({value}: SQLInjectionValidator) => {
		if(!hasSQLInjectionChars(value)) return true;
		
		Toaster({
				title: "Invalid input",
				description: "Suspicious content detected. Please review and try again.",
				status: 'warning',
		});

		return false;
	}

	return validator;
}

