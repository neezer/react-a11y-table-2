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
  columnReorder: {
    column: {
      display: "flex",
      flex: "0 0 auto",
      padding: "0 10px"
    },
    container: {
      backgroundColor: "rgb(225, 227, 231)",
      borderRadius: "4px",
      flex: "1 auto",
      overflow: "scroll",
      padding: "20px"
    },
    controlContainer: {
      backgroundColor: "#fff",
      border: "1px solid #808e9b",
      borderRadius: "4px",
      display: "flex",
      flexWrap: "nowrap",
      padding: "10px"
    },
    text: {
      backgroundColor: "#575fcf",
      borderRadius: "10px",
      color: "#fff",
      display: "flex",
      fontWeight: "bold",
      padding: "10px 20px"
    }
  },
  columnResize: {
    column: {
      display: "inline-flex",
      flex: "0 0 auto"
    },
    container: {
      backgroundColor: "rgb(225, 227, 231)",
      borderRadius: "4px",
      flex: "1 auto",
      padding: "20px"
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
