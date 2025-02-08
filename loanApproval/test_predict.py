from predict import predict_loan

# mock_data = {
#     "Gender": "Male",
#     "Married": "Yes",
#     "Dependents": "2",
#     "Education": "Graduate",
#     "Self_Employed": "No",
#     "ApplicantIncome": 5000,
#     "CoapplicantIncome": 2000,
#     "LoanAmount": 150,
#     "Loan_Amount_Term": 360,
#     "Credit_History": 1,
#     "Property_Area": "Urban"
# }

mock_data = {
        "Gender": "Female",
        "Married": "No",
        "Dependents": "0",
        "Education": "Not Graduate",
        "Self_Employed": "No",
        "ApplicantIncome": 1500,  # Low income
        "CoapplicantIncome": 0,
        "LoanAmount": 100, 
        "Loan_Amount_Term": 360,
        "Credit_History": 0,  # Poor credit history
        "Property_Area": "Urban"
}

result = predict_loan(mock_data)
print("Prediction Result:", result)