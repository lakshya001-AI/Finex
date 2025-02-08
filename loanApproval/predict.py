from flask import Flask, request, jsonify # type: ignore
import joblib # type: ignore
import numpy as np # type: ignore
import pandas as pd # type: ignore
from sklearn.preprocessing import LabelEncoder # type: ignore
from lime.lime_tabular import LimeTabularExplainer # type: ignore

# Load the model and training data
model = joblib.load("loanApproval/loan_model.pkl")
X_train = pd.read_csv("loanApproval/X_train.csv")
y_train = pd.read_csv("loanApproval/y_train.csv")  # Load target column

# Initialize the LabelEncoder
label_encoders = {
    "Gender": LabelEncoder(),
    "Married": LabelEncoder(),
    "Education": LabelEncoder(),
    "Self_Employed": LabelEncoder(),
    "Property_Area": LabelEncoder(),
}

# Fit label encoders on training data
for col in label_encoders:
    label_encoders[col].fit(X_train[col])

def preprocess_data(data):
    processed_data = data.copy()

    # Encode categorical columns using pre-fitted label encoders
    for col in label_encoders:
        if data[col] in label_encoders[col].classes_:
            processed_data[col] = label_encoders[col].transform([processed_data[col]])[0]
        else:
            # Handle unseen categories by assigning a default value
            processed_data[col] = -1  # Use -1 for unknown or unseen categories

    # Ensure numeric columns are correctly formatted
    numeric_columns = ["ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term", "Credit_History"]
    for col in numeric_columns:
        processed_data[col] = float(processed_data[col])

    return processed_data

def explain_prediction_with_lime(data):
    data_array = np.array([list(data.values())], dtype=float)

    # Create the LIME explainer
    explainer = LimeTabularExplainer(
        training_data=X_train.values,
        training_labels=y_train.values.flatten(),  # Flatten in case y_train is 2D
        mode="classification",
        feature_names=X_train.columns,
        class_names=["Rejected", "Approved"]
    )

    # Explain the prediction
    explanation = explainer.explain_instance(
        data_array[0],
        model.predict_proba,
        num_features=5
    )

    explanation_dict = explanation.as_list()
    return explanation_dict

def predict_loan(data):
    processed_data = preprocess_data(data)

    # Make the prediction
    prediction = model.predict([list(processed_data.values())])[0]
    prediction_probability = model.predict_proba([list(processed_data.values())])[0]

    reasons = [
        ["Income", "Sufficient" if processed_data["ApplicantIncome"] > 3000 else "Insufficient"],
        ["Credit History", "Good" if processed_data["Credit_History"] == 1 else "Poor"]
    ]

    lime_explanation = explain_prediction_with_lime(processed_data)

    return {
        "result": "Approved" if prediction == 1 else "Rejected",
        "probabilities": {
            "Rejected": prediction_probability[0],
            "Approved": prediction_probability[1]
        },
        "reasons": reasons,
        "lime_explanation": lime_explanation
    }

app = Flask(__name__)

@app.route('/loanApproval', methods=['POST'])
def loan_approval():
    try:
        # Get JSON data from the request
        form_data = request.get_json()
        
        # Process and predict loan approval
        prediction_result = predict_loan(form_data)

        # Return the prediction result as a JSON response
        return jsonify(prediction_result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)




