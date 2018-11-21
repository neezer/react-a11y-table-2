export const defaultStyles = {
  columnReorder: {
    column: {
      display: "flex",
      flex: "0 0 auto",
      padding: "0 10px"
    },
    controlContainer: {
      backgroundColor: "#fff",
      borderRadius: "4px",
      display: "flex",
      flex: "0 0 200px",
      flexDirection: "column",
      flexWrap: "nowrap",
      padding: "10px"
    },
    text: {
      backgroundColor: "#575fcf",
      borderRadius: "10px",
      color: "#fff",
      display: "flex",
      fontWeight: "bold",
      padding: "10px 20px",
      width: "100%"
    },
    wrapper: {
      display: "flex"
    }
  },
  columnResize: {
    column: {
      display: "inline-flex",
      flex: "0 0 auto"
    },
    controlContainer: {
      backgroundColor: "transparent",
      borderRadius: "4px",
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "scroll",
      paddingBottom: "15px"
    },
    dragHandle: {
      backgroundColor: "#575fcf",
      border: 0,
      borderRadius: "4px",
      cursor: "ew-resize",
      flex: "0 0 2px",
      flexWrap: "nowrap"
    },
    text: {
      backgroundColor: "#fff",
      borderRadius: "4px",
      color: "#1e272e",
      display: "flex",
      fontWeight: "bold",
      padding: "10px 20px",
      width: "100%"
    }
  },
  dragHandle: {
    backgroundColor: "#575fcf",
    border: 0,
    cursor: "ew-resize",
    display: "block",
    height: "100%",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: "5px"
  },
  edit: {
    container: {
      backgroundColor: "rgb(225, 227, 231)",
      borderRadius: "4px",
      flex: "1 auto",
      overflow: "scroll",
      padding: "20px"
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
