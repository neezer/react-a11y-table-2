export const defaultStyles = {
  actions: {
    button: {
      "&:first-of-type": {
        borderBottomLeftRadius: "4px",
        borderTopLeftRadius: "4px"
      },
      "&:hover": {
        backgroundColor: "#485460"
      },
      "&:last-of-type": {
        borderBottomRightRadius: "4px",
        borderTopRightRadius: "4px"
      },
      backgroundColor: "#1e272e",
      border: 0,
      color: "#fff",
      cursor: "pointer",
      fontSize: ".8rem",
      fontWeight: "bold",
      padding: "10px"
    },
    wrapper: {
      display: "flex",
      justifyContent: "right",
      padding: "20px 0"
    }
  },
  columnEdit: {
    column: {
      display: "flex",
      flex: "0 0 100px",
      height: "calc(100px - 10px)"
    },
    container: {
      backgroundColor: "rgb(225, 227, 231)",
      borderRadius: "4px",
      display: "flex",
      flex: "1 auto",
      flexWrap: "nowrap",
      overflow: "scroll"
    },
    dragHandle: {
      backgroundColor: "transparent",
      border: "1px solid red",
      cursor: "ew-resize",
      flexWrap: "nowrap",
      height: "calc(100px - 10px)",
      margin: "0 10px"
    },
    text: {
      alignItems: "center",
      backgroundColor: "#575fcf",
      borderRadius: "10px",
      color: "#fff",
      display: "flex",
      fontWeight: "bold",
      height: "100%",
      justifyContent: "center",
      width: "100%"
    }
  },
  grid: {
    cell: {
      backgroundColor: "#fff",
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
      backgroundColor: "rgb(225, 227, 231)",
      border: "1px solid rgb(225, 227, 231)",
      borderRadius: "4px",
      boxSizing: "border-box",
      display: "inline-block",
      overflow: "scroll"
    }
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "inherit"
  }
};
