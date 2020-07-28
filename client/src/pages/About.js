import React from "react";
// import logo from "../assets/logo.png";
import members from "../assets/members"

export default () => {

  const description = `
        A Chrome Extension where users can watch the price for a specific
        product in Tokopedia and Bukalapak. After users add a product to be
        tracked, our server will scrape the specified website periodically to
        track the changes in price and graphic of price changes will also be
        displayed. Users can also opt to receive notification (push notification
        and/or by email) when the price hit the target price set by the user.
    `

  return (
    <div style={styles.main} className="row">
      <div className="col-10 container mt-2" style={styles.bodyAbout}>
        
        <h1 className="text-center" style={styles.fontH1}>
          Our Team
        </h1>
        <hr className="border"></hr>
        <p style={styles.fontParagraph}>
          {description}
        </p>
        
        <div className="row justify-content-center">
          {members.map((member, idx) => {
            return (
              <div key={idx} className="col row justify-content-center">
                <img
                  src={member.image}
                  style={styles.imageSetting}
                  className="card-img-top rounded-circle mb-3"
                  alt="..."
                />
                <div className="">
                  <div className="card-body text-center text-info">
                    <h5 className="card-title slotName">{member.name}</h5>
                    <p className="card-text">FullStack Javascript</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div>
          <img
            src={logo}
            style={styles.imageLogo}
            className="card-img-top"
            alt=""
          />
        </div> */}
      </div>
    </div>
  );
};

const styles = {
  main: {
    marginTop: "8vh",
    backgroundImage: "linear-gradient(#162447, #1f4068)",
    height: "92vh",
  },
  bodyAbout: {
    backgroundColor: "#1f4068",
  },
  imageSetting: { 
    height: "10vw",
    width: "10vw"
  },
  imageLogo: {
    width: "103%",
    marginLeft: "-1.5%",
    height: "8em",
    marginTop: "-6em",
  },
  slotName: { paddingRight: "2rem", paddingLeft: "100rem" },
  fontParagraph: {
    fontFamily: "Helvetica",
    fontSize: "large",
    color: "#eeeeee"
  },
  fontH1: {
    fontFamily: "Helvetica",
    fontSize: "50px",
    color: "#eeeeee",
  },
};
