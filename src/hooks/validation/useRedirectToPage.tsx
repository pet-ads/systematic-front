import { useNavigate } from "react-router-dom";

export default function useRedirectToPage(url: string) {
    const navegate = useNavigate();
    navegate(url);
}