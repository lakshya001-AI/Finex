import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";

function FinancialAdvice() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [typedText, setTypedText] = useState(""); // State to hold typed text
  const [loading, setLoading] = useState(false);

  function logoutUser() {
    localStorage.removeItem("authToken");
    navigate("/");
  }

  let userFirstName = localStorage.getItem("userFirstName") || "John";
  let userLastName = localStorage.getItem("userLastName") || "Doe";
  let userEmailAddress =
    localStorage.getItem("userEmailAddress") || "john.doe@example.com";

  const [salary, setSalary] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [advice, setAdvice] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setTypedText(""); // Clear previous typed text

    try {
      const response = await fetch(
        "http://localhost:5000/api/financial-advice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ salary, expenses, savings }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data.advice) {
        setAdvice(data.advice);
        typeWriterEffect(data.advice); // Trigger typewriter effect when advice is received
      } else {
        setAdvice("No advice received from the server.");
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const typeWriterEffect = (text) => {
    let index = 0;
    const lines = text.split("\n"); // Split the response by new lines for line-by-line typing
    const timer = setInterval(() => {
      setTypedText((prev) => prev + lines[index] + "\n"); // Append each line to the typed text
      index += 1;
      if (index === lines.length) {
        clearInterval(timer); // Stop when all lines are typed
      }
    }, 100); // Adjust the speed (100 ms per character)
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
            <button
              className={Style.profileBtn}
              onClick={() => setShowUserInfo(!showUserInfo)}
            >
              Profile
            </button>

            {showUserInfo && (
              <div className={Style.userInfoDiv}>
                <p className={Style.userInfoDivPara1}>
                  {`${userFirstName} ${userLastName}`}
                </p>
                <p className={Style.userInfoDivPara2}>{userEmailAddress}</p>
                <button className={Style.logoutBtn} onClick={logoutUser}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={Style.financialAdviceMainDiv}>
          <div className={Style.financialAdviceMainDiv1}>
            <h1>
              Your Guide to Financial{" "}
              <span class={Style.gradientText}>Wellness.</span>
            </h1>
            <p>
              Discover customized strategies for saving, investing, and growing
              your wealth. We bring expert advice directly to you, tailored to
              your needs
            </p>

            <div className={Style.financialAdviceBtnDivs}>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter your monthly salary"
              />

              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="Enter your monthly expenses"
              />

              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="Enter your total savings"
              />

<button onClick={handleSubmit} disabled={loading}>
            {loading ? "Fetching Advice..." : "Get Advice"}
          </button>
            </div>
          </div>

          <div className={Style.financialAdviceMainDiv2}>
  {typedText ? (
    <div style={{ padding: "30px" }}>
      <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
        {typedText} {/* Displaying the typed text */}
      </pre>
    </div>
  ) : (
    <div style={{ padding: "30px", fontSize: "16px", color: "gray", textAlign: "center" }}>
      No results found. Please provide the necessary details for advice.
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
}

export default FinancialAdvice;
