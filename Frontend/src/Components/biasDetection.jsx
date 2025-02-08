import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faInfoCircle,
  faArrowUpRightFromSquare,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function BiasDetection() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage(null); // Clear previous error messages
  };

  function logoutUser() {
    localStorage.removeItem("authToken");
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bias/analyze-bias",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResults(response.data.results);
    } catch (error) {
      console.error("Error analyzing bias:", error.message);
      setErrorMessage(error.response?.data?.error || "Failed to analyze bias.");
    }
  };

  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyzeClick = () => {
    setLoading(true); // Show loading message after clicking Analyze
    setShowResults(false); // Hide previous results
    setTimeout(() => {
      setLoading(false); // Hide loading message after 5 seconds
      setShowResults(true); // Show results
    }, 5000); // Simulate 5 seconds loading time
  };

  return (
    <div className={Style.mainDiv}>
      <div className={Style.mainPageMainDiv}>
        <div className={Style.navBarMainPage}>
          <div className={Style.logoNavBarMainPage}>
            <h1>FINEX</h1>
          </div>

          <div className={Style.linkNavBarMainPage}>
            <Link className={Style.linkElementNavBar} to="/mainPage">
              Home
            </Link>
            <Link className={Style.linkElementNavBar} to="/biasDetection">
              Bias
            </Link>
            <Link className={Style.linkElementNavBar} to="/loanApproval">
              Loans
            </Link>
            <Link className={Style.linkElementNavBar} to="/financialAdvice">
              Advice
            </Link>
          </div>

          <div className={Style.ProfileBtnNavBarMainPage}>
            <Link
                           className={Style.profileBtn}
                           to="/profilePage"
                         >
                           Profile
                         </Link>

            {showUserInfo && (
              <div className={Style.userInfoDiv}>
                <p
                  className={Style.userInfoDivPara1}
                >{`${userFirstName} ${userLastName}`}</p>
                <p className={Style.userInfoDivPara2}>{userEmailAddress}</p>
                <button className={Style.logoutBtn} onClick={logoutUser}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 
        <div style={{ color: "white" }}>
          <h1>Bias Detection</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Analyze</button>
          </form>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {results && (
            <div>
              <h2>Results</h2>
              <p>Overall Accuracy: {results.overall_accuracy}</p>
              <h3>By Group</h3>
              <pre>{JSON.stringify(results.by_group, null, 2)}</pre>
            </div>
          )}
        </div> */}

        <div className={Style.biasPredictionMainDiv}>
          {/* Gradient Information Div */}
          <div className={Style.biasPredictionMainDiv1}>
            <h1 className={Style.biasPredictionMainDiv1Heading}>
              The Future of Fair AI is Here.
            </h1>
            <p className={Style.biasPredictionMainDiv1Para}>
              Using advanced AI techniques such as the Random Forest Model and
              the Fairlearn library, we detect bias in data with precision.
              Empowering fairness in decision-making with cutting-edge
              technology.
            </p>

            <div className={Style.BiasDetectionStepsDiv}>
              <div className={Style.BiasDetectionStepDiv}>
                <div className={Style.stepNumberAndHeadingDiv}>
                  <p className={Style.stepNumberPara}>1</p>
                  <p className={Style.stepHeading}>Upload Your Dataset</p>
                </div>
              </div>
              <div className={Style.BiasDetectionStepDiv}>
                <div className={Style.stepNumberAndHeadingDiv}>
                  <p className={Style.stepNumberPara}>2</p>
                  <p className={Style.stepHeading}>Advanced Bias Detection</p>
                </div>
              </div>
              <div className={Style.BiasDetectionStepDiv}>
                <div className={Style.stepNumberAndHeadingDiv}>
                  <p className={Style.stepNumberPara}>3</p>
                  <p className={Style.stepHeading}>Get Actionable Insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Input and Results Div */}
          {/* <div className={Style.biasPredictionMainDiv2}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="">Please upload the CSV File</label>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Analyze</button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {results && (
              <div>
                <h2>Results</h2>
                <p>Overall Accuracy: {results.overall_accuracy}</p>
                <h3>By Group</h3>
                <ul>
                  {Object.entries(results.by_group).map(([group, value]) => (
                    <li key={group}>
                      <strong>{group}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}

          <div className={Style.biasPredictionMainDiv2}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="file-upload">Please provide the Deployed Model Link</label>
              <input type="text" id="file-upload" className={Style.modelLinkInput} placeholder="Deployed Model Link"/>
              <label htmlFor="file-upload">Please upload the CSV File</label>
              <input type="file" id="file-upload" onChange={handleFileChange} placeholder="Please"/>
              <button type="submit">Analyze</button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {results && (
              <div className={Style.resultsContainer}>
                <p className={Style.overAllModelAccuracyPara}>
                  <strong>
                    <FontAwesomeIcon icon={faCircleChevronRight} /> Overall
                    Model Accuracy:
                  </strong>{" "}
                  <span
                    style={{
                      color:
                        results.overall_accuracy >= 0.7 ? "green" : "orange",
                    }}
                  >
                    {results.overall_accuracy * 100}%
                  </span>
                </p>
                <ul>
                  {Object.entries(results.by_group).map(([group, value]) => (
                    <li key={group}>
                      <strong>{group}:</strong>{" "}
                      <span style={{ color: value === 1 ? "green" : "red" }}>
                        {value === 1
                          ? "Fair and accurate predictions."
                          : "Bias detected; less accurate predictions."}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className={Style.conclusion}>
                  <h3>
                    {" "}
                    <FontAwesomeIcon icon={faCircleChevronRight} /> Conclusion
                  </h3>
                  <p>
                    The model demonstrates an overall accuracy of{" "}
                    <strong>{results.overall_accuracy * 100}%</strong>. Based on
                    the group-wise analysis:
                  </p>
                  <ul>
                    <li>
                      <strong>Male:</strong> The model shows fairness and
                      accurate predictions.
                    </li>
                    <li>
                      <strong>Female:</strong> The model exhibits potential
                      bias, leading to less accurate predictions.
                    </li>
                  </ul>
                  <p style={{ color: "#FF6347" }}>
                    Note: Improvements are recommended to ensure gender fairness
                    in predictions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiasDetection;
