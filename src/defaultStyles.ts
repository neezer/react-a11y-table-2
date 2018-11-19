export const defaultStyles = {
  actions: {
    wrapper: {
      display: "flex",
      justifyContent: "right"
    }
  },
  grid: {
    cell: {
      boxSizing: "border-box",
      overflow: "hidden",
      padding: "10px 6px",
      whiteSpace: "nowrap"
    },
    headers: {
      backgroundColor: "rgb(247, 248, 249)",
      borderBottom: "1px solid rgb(225, 227, 231)",
      boxSizing: "border-box",
      color: "rgb(148, 157, 173)",
      fontSize: "0.9rem",
      padding: "16px 6px 10px",
      textAlign: "left",
      textTransform: "uppercase"
    },
    row: {
      "& + *": {
        borderTop: "1px solid rgb(225, 227, 231)"
      }
    },
    table: {
      borderCollapse: "collapse",
      tableLayout: "fixed"
    },
    wrapper: {
      border: "1px solid rgb(225, 227, 231)",
      borderRadius: "4px",
      boxSizing: "border-box",
      display: "inline-block",
      overflow: "scroll"
    }
  },
  reorder: {
    column: {
      display: "flex",
      flex: "0 0 100px",
      height: "calc(100px - 10px)"
    },
    container: {
      display: "flex",
      flexWrap: "nowrap"
    },
    text: {
      alignItems: "center",
      backgroundColor: "#aaa",
      borderRadius: "10px",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      margin: "10px",
      width: "100%"
    }
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "inherit"
  }
};
