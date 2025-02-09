import React, { useState } from "react";
import { Link } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BiasDetection() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage(null); // Clear previous error messages
  };

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

  const chartData = results
    ? [{ name: "Overall Accuracy", accuracy: results.overall_accuracy * 100 }]
    : [];

  return (
    <div className={Style.mainDiv}>
      <div className={Style.mainPageMainDiv}>
        {/* Navigation bar */}
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
          </div>
        </div>

        {/* Bias Detection */}
        <div className={Style.biasPredictionMainDiv}>
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


          <div className={Style.biasPredictionMainDiv2}>
      {/* Form Section */}
      <div className={Style.formSection}>
        <form onSubmit={handleSubmit} className={Style.fileUploadForm}>
          <label htmlFor="file-upload" className={Style.fileUploadLabel}>
            Upload the model deployment link
          </label>
          <input
            type="text"
            className={Style.deploymentLinkInput}
            placeholder="Deployment Link"
          />
          <label htmlFor="file-upload" className={Style.fileUploadLabel}>
            Upload the CSV File
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className={Style.fileUploadInput}
          />

          <button type="submit" className={Style.analyzeButton}>
            Analyze
          </button>
        </form>
        {errorMessage && (
          <p className={Style.errorMessage}>
            {errorMessage}
          </p>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className={Style.resultsContainer}>
          {/* Chart Section */}
          <div className={Style.chartSection}>
            <h3 className={Style.chartHeading}>Overall Accuracy</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conclusion Section */}
          <div className={Style.conclusionSection}>
            <h3 className={Style.conclusionHeading}>
               Conclusion
            </h3>

            <p className={Style.accuracyText}>
              The model demonstrates an overall accuracy of <strong>{results.overall_accuracy * 100}%</strong>.
            </p>

            <ul className={Style.groupAnalysisList}>
              {Object.entries(results.by_group).map(([group, value]) => (
                <p key={group} className={Style.groupAnalysisItem}>
                  <strong>{group}:</strong>{" "}
                  <span
                    style={{
                      color: value === 1 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {value === 1
                      ? "Fair and accurate predictions."
                      : "Bias detected; less accurate predictions."}
                  </span>
                </p>
              ))}
            </ul>
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


