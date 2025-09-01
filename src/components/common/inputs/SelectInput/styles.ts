const colors = {
  background: "#EBF0F3",
  text: "#2E4B6C",
  hover: "rgb(144, 205, 244)",
  selected: "rgb(190, 227, 248)",
  clearFilters: "rgb(38, 60, 86)",
};

export const formControlStyle = {
  display: "flex",
  flexDir: "column",
  bgColor: "#C9D9E5",
  borderRadius: "3%",
};

export const menuListStyle = {
  position: "fixed" as const,
  zIndex: 1500,
  bg: colors.background,
  color: colors.text,
  p: 0,
};

export const menuItemStyle = (isSelected: boolean) => ({
  w: "100%",
  bg: isSelected ? colors.selected : colors.background,
  _hover: { bg: colors.hover },
});

export const clearFiltersText = {
  flex: 1,
  textAlign: "center" as const,
  fontWeight: "semibold",
  color: colors.clearFilters,
};
