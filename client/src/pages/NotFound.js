import React from "react";

export default () => {
  return (
    <div style={styles.main}>
      <h1 className="text-center" style={styles.fontH1}>
        <span role="img" aria-label="">
          🔍
        </span>{" "}
        404: Page Not Found
      </h1>
    </div>
  );
};

const styles = {
  main: {
    marginTop: "8vh",
    height: "92vh",
    backgroundImage: "linear-gradient(#162447, #1f4068)",
    color: "#eee",
    paddingTop: "30vh"
  },
  fontH1: { 
    fontFamily: "Comic Sans MS", 
    fontSize: "50px",
    color: "#eeeeee",
    
  },
}
