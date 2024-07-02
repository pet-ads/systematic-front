import { ReactNode } from "react";
import "./style.css";

interface IHomepageModal {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function HomepageModal({ show, onClose, children }: IHomepageModal) {
    
    if (!show) {
        return null;
    }
    
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="containerModal" onClick={handleClickOutside}>
            {children}
        </div>
    );
}
