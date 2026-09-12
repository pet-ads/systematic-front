// styles.ts
export const conteiner = {
  mt: "1rem",
  w: "100%", // pega só o espaço disponível no FlexLayout
  h: "calc(100vh - 7.5rem)",
};

export const dataBaseconteiner = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(32rem, 1fr))",
  justifyContent: "center",
  justifyItems: "center",
  boxSizing: "border-box",
  width: "95%",
  gap: "4rem",
  margin: "3rem auto",
  padding: "1rem",
};

export const assingStudiesButton = {
  bgColor: "#263C56",
  color: "#FFFFFF",
  position: "fixed",
  right: "5rem",
  bottom: "3rem",
  borderRadius: "8px",
  _hover: {
    bgColor: "#C9D9E5",
    color: "#263C56",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
  },
  transition: "all 0.3s ease",
  outline: "none",
  _focus: {
    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
  },
}

export const assingStudiesButtonDisabled = {
  bgColor: "#E2E8F0",
  color: "#A0AEC0",
  position: "fixed",
  right: "5rem",
  bottom: "3rem",
  borderRadius: "8px",
  cursor: "not-allowed",
  opacity: 0.8,
  boxShadow: "none",
  outline: "none",
  transition: "all 0.3s ease",

  _hover: {
    bgColor: "#E2E8F0",
    color: "#A0AEC0",
    boxShadow: "none",
  },

  _focus: {
    boxShadow: "none",
  },
}