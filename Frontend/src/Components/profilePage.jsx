// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Style from "../App.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faSignOutAlt,
//   faInfoCircle,
//   faArrowUpRightFromSquare,
// } from "@fortawesome/free-solid-svg-icons";

// import axios from "axios";

// function ProfilePage() {
//   const navigate = useNavigate();
//   const [showUserInfo, setShowUserInfo] = useState(false);

//   function logoutUser() {
//     localStorage.removeItem("authToken");
//     navigate("/");
//   }

//   let userFirstName = localStorage.getItem("userFirstName") || "John";
//   let userLastName = localStorage.getItem("userLastName") || "Doe";
//   let userEmailAddress =
//     localStorage.getItem("userEmailAddress") || "john.doe@example.com";

//     useEffect(()=>{

//       async function getPersonalFinancialAdvice(){

//         try {

//           let response = await axios.post("http://localhost:5000/userFinancialAdvice",{userEmailAddress});
          
//         } catch (error) {
//           console.log("Error getting data: ",error);
//         }
//       }

//       getPersonalFinancialAdvice();
//     },[]);

//   return <>
//   <div className={Style.mainDiv}>

//     <div className={Style.mainPageMainDiv}>

//         <div className={Style.navBarMainPage}>
//                     <div className={Style.logoNavBarMainPage}>
//                       <h1>FINEX</h1>
//                     </div>
        
//                     <div className={Style.linkNavBarMainPage}>
//                       <Link className={Style.linkElementNavBar} to="/mainPage">
//                         Home
//                       </Link>
//                       <Link className={Style.linkElementNavBar} to="/biasDetection">
//                         Bias
//                       </Link>
//                       <Link className={Style.linkElementNavBar} to="/loanApproval">
//                         Loans
//                       </Link>
//                       <Link className={Style.linkElementNavBar} to="/financialAdvice">
//                         Advice
//                       </Link>
//                     </div>
        
//                     <div className={Style.ProfileBtnNavBarMainPage}>
//                       <Link
//                                      className={Style.profileBtn}
//                                      to="/profilePage"
//                                    >
//                                      Profile
//                                    </Link>
        
//                       {showUserInfo && (
//                         <div className={Style.userInfoDiv}>
//                           <p
//                             className={Style.userInfoDivPara1}
//                           >{`${userFirstName} ${userLastName}`}</p>
//                           <p className={Style.userInfoDivPara2}>{userEmailAddress}</p>
//                           <button className={Style.logoutBtn} onClick={logoutUser}>
//                             Logout
//                           </button>
//                         </div>
//                       )}
//                     </div></div>


//                    <div className={Style.loanApprovalMainDiv}>
//                            <div className={Style.loanApprovalMainDivInnerDiv}>

//                             <div className={Style.profilePageInnerDiv1}>

//                                 <div className={Style.profilePageInnerDiv11}>
//                                   {/* Modify this to show good message on the profile section */}
//                                   <h1>{userFirstName} {userLastName}</h1>
//                                   <p>{userEmailAddress}</p>
//                                 </div>

//                                 <div className={Style.profilePageInnerDiv12}>
//                                 <button className={Style.logoutBtn} onClick={logoutUser}>
//                             Logout
//                           </button>
//                                 </div>

//                             </div>

//                             <div className={Style.profilePageInnerDiv2}>

//                             </div>

//                            </div>
//                          </div>


//     </div>
//   </div>
//   </>;
// }

// export default ProfilePage;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";

function ProfilePage() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [loanStatus, setLoanStatus] = useState([]); // State to store loan status
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const userFirstName = localStorage.getItem("userFirstName") || "John";
  const userLastName = localStorage.getItem("userLastName") || "Doe";
  const userEmailAddress =
    localStorage.getItem("userEmailAddress") || "john.doe@example.com";

  useEffect(() => {
    async function getPersonalFinancialAdvice() {
      try {
        const response = await axios.post(
          "http://localhost:5000/userFinancialAdvice",
          { userEmailAddress }
        );
        setLoanStatus(response.data.loanStatus); // Set the loan status
      } catch (error) {
        console.error("Error getting data:", error);
        setErrorMessage("Unable to fetch financial advice");
      }
    }
    getPersonalFinancialAdvice();
  }, [userEmailAddress]);

  console.log(loanStatus);
  
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
            <Link className={Style.profileBtn} to="/profilePage">
              Profile
            </Link>

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

        <div className={Style.loanApprovalMainDiv}>
          <div className={Style.loanApprovalMainDivInnerDiv}>
            <div className={Style.profilePageInnerDiv1}>
              <div className={Style.profilePageInnerDiv11}>
                <h1>
                  {userFirstName} {userLastName}
                </h1>
                <p>{userEmailAddress}</p>
              </div>

              <div className={Style.profilePageInnerDiv12}>
                <button className={Style.logoutBtn} onClick={logoutUser}>
                  Logout
                </button>
              </div>
            </div>

            <div className={Style.profilePageInnerDiv2}>
            {loanStatus ? (
                <div>
                  {loanStatus.map((advice, index) => (
                    <div key={index} className={Style.adviceCard}>
                      <p>{advice.result}</p>
                      <p><strong>Probabilities:</strong> Rejected: {advice.probabilities.Rejected*100} , Approved: {advice.probabilities.Approved*100}</p>
                      <p><strong>Reasons:</strong></p>
                      <ul>
                        {advice.reasons.map((reason, i) => (
                          <li key={i}>{`${reason[0]}: ${reason[1]}`}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Loading financial advice...</p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
