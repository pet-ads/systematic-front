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
  margin: "0 auto",
  padding: "1rem",
};