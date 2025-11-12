// // External Library
import { useState, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

// // Styles
import styles from "./styles.module.css";

// // Types
import type { GenericTableProps, SortConfig } from "./types";

export default function DefaultTable<T extends object>({
  title,
  columns,
  data,
  enableSorting = true, 
  externalSortConfig,
  onExternalSort
}: GenericTableProps<T>) {
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig<T>>(null);

  const sortConfig = externalSortConfig !== undefined ? externalSortConfig : internalSortConfig;

  const sortedData = useMemo(() => {
    if (!sortConfig || !enableSorting) return data;
    const key = sortConfig.key as keyof T;

    if (data.length > 0 && !(key in data[0])) {
      return data;
    }

    const sorted = [...data].sort((primary, secund) => {
      
      const primaryValue = primary[key];
      const nextValue = secund[key];
      if (primaryValue < nextValue)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (primaryValue > nextValue)
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig, enableSorting]);

  const handleHeaderClick = (key: keyof T | string) => {
    if (data.length > 0 && !(key in data[0])) {
      return;
    }

    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const newConfig = { key: key as keyof T, direction };

    if (onExternalSort) {
      onExternalSort(newConfig);
    } else {
      setInternalSortConfig(newConfig);
    }
  };

  return (
    <div className={styles.tableContainer}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={styles.th}
                  style={{ width: col.width }}
                  onClick={() => enableSorting && handleHeaderClick(col.key)}
                >
                  <div className={styles.headerContent}>
                    <span>{col.label}</span>
                    {enableSorting && (
                      <span className={styles.chevronIcon}>
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )
                        ) : (
                          <FaChevronDown style={{ opacity: 0.3 }} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, rowIndex) => (
                <tr key={rowIndex} className={styles.tr}>
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={styles.td}
                      style={{
                        textAlign: column.render
                          ? "center"
                          : typeof item[column.key as keyof T] === "number"
                          ? "end"
                          : "start",
                      }}
                    >
                      {column.render ? (
                        column.render(item, rowIndex)
                      ) : (
                        <div
                          className={styles.truncate}
                          title={String(item[column.key as keyof T] ?? "")}
                        >
                          {String(item[column.key as keyof T] ?? "")}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className={styles.emptyRow}>
                <td colSpan={columns.length}>Nenhum dado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

