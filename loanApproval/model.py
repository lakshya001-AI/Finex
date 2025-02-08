import pandas as pd # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from sklearn.ensemble import RandomForestClassifier # type: ignore
import joblib # type: ignore

# Example dataset - Replace this with a real dataset
data = pd.DataFrame({
    "Gender": [1, 0, 1, 0, 1],
    "Married": [1, 0, 1, 0, 1],
    "Dependents": [0, 1, 2, 0, 1],
    "Education": [0, 1, 0, 1, 0],
    "Self_Employed": [0, 0, 1, 0, 1],
    "ApplicantIncome": [5000, 2000, 4000, 2500, 3000],
    "CoapplicantIncome": [0, 1500, 0, 1200, 800],
    "LoanAmount": [150, 100, 200, 120, 130],
    "Loan_Amount_Term": [360, 120, 360, 180, 240],
    "Credit_History": [1, 0, 1, 1, 1],
    "Property_Area": [2, 0, 1, 2, 1],
    "Status": [1, 0, 1, 0, 1],  # 1 for Approved, 0 for Rejected
})

# Feature and target separation
X = data.drop("Status", axis=1)
y = data["Status"]

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Save the model, X_train, and y_train
joblib.dump(model, "loanApproval/loan_model.pkl")
X_train.to_csv("loanApproval/X_train.csv", index=False)
y_train.to_csv("loanApproval/y_train.csv", index=False)  # Save target column
print("Model, X_train, and y_train saved successfully!")


