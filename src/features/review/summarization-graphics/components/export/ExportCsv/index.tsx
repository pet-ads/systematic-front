export function downloadCSV(data: Array<Record<string, any>>, fileName: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), 
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(",")) // Valores
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute("download", `${fileName}.csv`);
  link.click();
  URL.revokeObjectURL(url);
}
