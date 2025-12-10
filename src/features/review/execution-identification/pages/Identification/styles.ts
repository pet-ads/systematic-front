// styles.ts
export const conteiner = {
  mt: 5,
  w: "100%", // pega só o espaço disponível no FlexLayout
  h: "calc(100vh - 7.5rem)",
};

export const dataBaseconteiner = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(32rem, 1fr))",
  justifyContent: "center",
  justifyItems: "center",
  boxSizing: "border-box",
  width: "100%",
  gap: "2rem",
  margin: "0 auto",
  padding: "0rem",
  maxHeight: "calc(100vh - 1.5rem)",
};