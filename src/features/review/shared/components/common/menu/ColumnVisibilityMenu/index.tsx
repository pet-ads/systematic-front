// External library
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { CgOptions } from "react-icons/cg";

// Hooks
import { ColumnVisibility } from "@features/review/shared/hooks/useVisibilityColumns";

// Types
type ColumnVisibilityMenuInput = {
  columnsVisible: ColumnVisibility;
  toggleColumnVisibility: (column: keyof ColumnVisibility) => void;
};

// Styles
import styles from "./styles.module.css";

const columnLabels: {
  [K in keyof Omit<ColumnVisibility, "studyReviewId">]: string;
} = {
  title: "Title",
  authors: "Author",
  venue: "Journal",
  year: "Year",
  selectionStatus: "Selection",
  extractionStatus: "Extraction",
  score: "Score",
  readingPriority: "Priority",
};

// Animations
const DROPDOWN_MENU = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: easeInOut },
};

export default function ColumnVisibilityMenu({
  columnsVisible,
  toggleColumnVisibility,
}: ColumnVisibilityMenuInput) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownMenu = useRef<HTMLDivElement>(null);

  const handleMenuState = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownMenu.current &&
      !dropdownMenu.current.contains(event.target as Node)
    )
      setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={dropdownMenu}
    >
      <button onClick={handleMenuState} className={styles["dropdown-toggle"]}>
        <div className={styles["dropdown-toggle-content"]}>
          <CgOptions />
          <span>View</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...DROPDOWN_MENU}
            className={styles["dropdown-container"]}
          >
            {Object.entries(columnLabels)
              .filter(
                ([key]) =>
                  columnsVisible[key as keyof ColumnVisibility] !== null
              )
              .map(([key, label]) => (
                <label key={key} className={styles["dropdown-label"]}>
                  <input
                    type="checkbox"
                    checked={
                      columnsVisible[key as keyof ColumnVisibility] as boolean
                    }
                    onChange={() =>
                      toggleColumnVisibility(key as keyof ColumnVisibility)
                    }
                  />
                  <span style={{ marginLeft: 8 }}>{label}</span>
                </label>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
