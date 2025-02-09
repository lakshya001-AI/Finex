// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Style from "../App.module.css";

// function FinancialAdvice() {
//   const navigate = useNavigate();
//   const [showUserInfo, setShowUserInfo] = useState(false);
//   const [typedText, setTypedText] = useState(""); // State to hold typed text
//   const [loading, setLoading] = useState(false);

//   function logoutUser() {
//     localStorage.removeItem("authToken");
//     navigate("/");
//   }

//   let userFirstName = localStorage.getItem("userFirstName") || "John";
//   let userLastName = localStorage.getItem("userLastName") || "Doe";
//   let userEmailAddress =
//     localStorage.getItem("userEmailAddress") || "john.doe@example.com";

//   const [salary, setSalary] = useState("");
//   const [expenses, setExpenses] = useState("");
//   const [savings, setSavings] = useState("");
//   const [advice, setAdvice] = useState("");

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTypedText(""); // Clear previous typed text

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/financial-advice",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ salary, expenses, savings }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.advice) {
//         setAdvice(data.advice);
//         typeWriterEffect(data.advice); // Trigger typewriter effect when advice is received
//       } else {
//         setAdvice("No advice received from the server.");
//       }
//     } catch (error) {
//       console.error("Error fetching advice:", error);
//       setAdvice("An error occurred: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const typeWriterEffect = (text) => {
//     let index = 0;
//     const lines = text.split("\n"); // Split the response by new lines for line-by-line typing
//     const timer = setInterval(() => {
//       setTypedText((prev) => prev + lines[index] + "\n"); // Append each line to the typed text
//       index += 1;
//       if (index === lines.length) {
//         clearInterval(timer); // Stop when all lines are typed
//       }
//     }, 100); // Adjust the speed (100 ms per character)
//   };

//   return (
//     <div className={Style.mainDiv}>
//       <div className={Style.mainPageMainDiv}>
//         <div className={Style.navBarMainPage}>
//           <div className={Style.logoNavBarMainPage}>
//             <h1>FINEX</h1>
//           </div>

//           <div className={Style.linkNavBarMainPage}>
//             <Link className={Style.linkElementNavBar} to="/mainPage">
//               Home
//             </Link>
//             <Link className={Style.linkElementNavBar} to="/biasDetection">
//               Bias
//             </Link>
//             <Link className={Style.linkElementNavBar} to="/loanApproval">
//               Loans
//             </Link>
//             <Link className={Style.linkElementNavBar} to="/financialAdvice">
//               Advice
//             </Link>
//           </div>

//           <div className={Style.ProfileBtnNavBarMainPage}>
//             <button
//               className={Style.profileBtn}
//               onClick={() => setShowUserInfo(!showUserInfo)}
//             >
//               Profile
//             </button>

//             {showUserInfo && (
//               <div className={Style.userInfoDiv}>
//                 <p className={Style.userInfoDivPara1}>
//                   {`${userFirstName} ${userLastName}`}
//                 </p>
//                 <p className={Style.userInfoDivPara2}>{userEmailAddress}</p>
//                 <button className={Style.logoutBtn} onClick={logoutUser}>
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className={Style.financialAdviceMainDiv}>
//           <div className={Style.financialAdviceMainDiv1}>
//             <h1>
//               Your Guide to Financial{" "}
//               <span class={Style.gradientText}>Wellness.</span>
//             </h1>
//             <p>
//               Discover customized strategies for saving, investing, and growing
//               your wealth. We bring expert advice directly to you, tailored to
//               your needs
//             </p>

//             <div className={Style.financialAdviceBtnDivs}>
//               <input
//                 type="number"
//                 value={salary}
//                 onChange={(e) => setSalary(e.target.value)}
//                 placeholder="Enter your monthly salary"
//               />

//               <input
//                 type="number"
//                 value={expenses}
//                 onChange={(e) => setExpenses(e.target.value)}
//                 placeholder="Enter your monthly expenses"
//               />

//               <input
//                 type="number"
//                 value={savings}
//                 onChange={(e) => setSavings(e.target.value)}
//                 placeholder="Enter your total savings"
//               />

// <button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Fetching Advice..." : "Get Advice"}
//           </button>
//             </div>
//           </div>

//           <div className={Style.financialAdviceMainDiv2}>
//   {typedText ? (
//     <div style={{ padding: "30px" }}>
//       <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>
//         {typedText} {/* Displaying the typed text */}
//       </pre>
//     </div>
//   ) : (
//     <div style={{ padding: "30px", fontSize: "16px", color: "gray", textAlign: "center" }}>
//       No results found. Please provide the necessary details for advice.
//     </div>
//   )}
// </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FinancialAdvice;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import MarkdownIt from "markdown-it";
import { PuffLoader, RingLoader } from "react-spinners";
const md = new MarkdownIt();

function FinancialAdvice() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mandatory");

  const tabStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  };

  const tabButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#2c2c2c",
    border: "1px solid #444",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const activeTabStyle = {
    ...tabButtonStyle,
    backgroundColor: "#14a6ff",
    border: "1px solid #14a6ff",
  };

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
  const [adviceType, setAdviceType] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setStreamLoading(false);
    setDisplayText("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/financial-advice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salary, expenses, savings, adviceType }),
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Once we start receiving data, switch from Puff to Ring loader
      setLoading(false);
      setStreamLoading(true);

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setStreamLoading(false);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setStreamLoading(false);
              return;
            }
            try {
              const parsedData = JSON.parse(data);
              setDisplayText((prev) => prev + parsedData.text);
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
      setLoading(false);
      setStreamLoading(false);
    }
  };

  return (
    <div className={Style.mainDiv}>
      <div className={Style.mainPageMainDiv}>
        {/* Navigation bar code remains the same */}
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
              <span className={Style.gradientText}>Wellness.</span>
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

              <select
                value={adviceType}
                onChange={(e) => setAdviceType(e.target.value)}
                className={Style.dropdown}
              >
                <option value="" disabled>
                  Select Advice Type
                </option>
                <option value="investment">Investment Advice</option>
                <option value="retirement">Retirement Planning</option>
                <option value="debt">Debt Management</option>
                <option value="budgeting">Budgeting Advice</option>
                <option value="tax">Tax Planning</option>
              </select>

              <button
                onClick={handleSubmit}
                disabled={loading || streamLoading}
              >
                {loading || streamLoading ? "Fetching Advice..." : "Get Advice"}
              </button>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              backgroundColor: "#1f1f1f",
              height: "52vh",
              borderRadius: "40px",
              marginTop: "30px",
              overflowY: "auto",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              position: "relative",
              scrollBehavior: "smooth",
            }}
          >
            {loading ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <PuffLoader color="#14a6ff" size={200} />
              </div>
            ) : displayText ? (
              <div
                style={{
                  padding: "40px",
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "16px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: "1.8",
                    color: "#fff",
                    margin: 0,
                    paddingBottom: "50px", // Space for the loader at bottom
                  }}
                  dangerouslySetInnerHTML={{ __html: md.render(displayText) }}
                />
                {streamLoading && (
                  <div
                    style={{
                      position: "fixed",
                      bottom: "40px",
                      right: "40px",
                      background: "rgba(31, 31, 31, 0.8)",
                      padding: "10px",
                      borderRadius: "50%",
                      backdropFilter: "blur(5px)",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                      zIndex: 10,
                    }}
                  >
                    <RingLoader color="#2e84ff" size={27} />
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  color: "gray",
                  fontSize: "16px",
                  textAlign: "center",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                <div
                  style={{
                    maxWidth: "400px",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  No results found. Please provide the necessary details for
                  advice.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialAdvice;