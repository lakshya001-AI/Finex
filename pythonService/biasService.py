# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# from fairlearn.metrics import MetricFrame
# from sklearn.metrics import accuracy_score

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# @app.route('/analyze-bias', methods=['POST'])
# def analyze_bias():
#     try:
#         # Accept file upload
#         if 'file' not in request.files:
#             print("No file found in the request.")
#             return jsonify({"error": "No file uploaded"}), 400

#         file = request.files['file']
#         print("File received:", file.filename)
#         data = pd.read_csv(file)

#         # Validate dataset
#         if 'Gender' not in data.columns or 'ApprovalStatus' not in data.columns:
#             print("Dataset columns:", data.columns)
#             return jsonify({"error": "Dataset must contain 'Gender' and 'ApprovalStatus' columns"}), 400

#         # Example columns: 'Gender' (protected attribute), 'ApprovalStatus' (target)
#         y_true = data['ApprovalStatus']
#         y_pred = data['PredictedApproval']  # Example: Add a column with predictions
#         sensitive_feature = data['Gender']

#         # Evaluate bias using Fairlearn
#         metric_frame = MetricFrame(
#             metrics=accuracy_score,
#             y_true=y_true,
#             y_pred=y_pred,
#             sensitive_features=sensitive_feature
#         )

#         # Format results
#         results = {
#             "overall_accuracy": metric_frame.overall,
#             "by_group": metric_frame.by_group.to_dict()
#         }

#         return jsonify({"success": True, "results": results}), 200

#     except Exception as e:
#         print("Exception occurred:", str(e))
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)



from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from fairlearn.metrics import MetricFrame
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze-bias', methods=['POST'])
def analyze_bias():
    try:
        # Accept file upload
        if 'file' not in request.files:
            print("No file found in the request.")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        print("File received:", file.filename)
        data = pd.read_csv(file)

        # Validate dataset
        if 'Gender' not in data.columns or 'ApprovalStatus' not in data.columns:
            print("Dataset columns:", data.columns)
            return jsonify({"error": "Dataset must contain 'Gender' and 'ApprovalStatus' columns"}), 400

        # Example columns: 'Gender' (protected attribute), 'ApprovalStatus' (target)
        y_true = data['ApprovalStatus']
        y_pred = data['PredictedApproval']  # Example: Add a column with predictions
        sensitive_feature = data['Gender']

        # Evaluate bias using Fairlearn
        metric_frame = MetricFrame(
            metrics=accuracy_score,
            y_true=y_true,
            y_pred=y_pred,
            sensitive_features=sensitive_feature
        )

        # Format results
        results = {
            "overall_accuracy": metric_frame.overall,
            "by_group": metric_frame.by_group.to_dict()
        }

        # Mitigation Advice based on accuracy difference
        mitigation_advice = ""
        if 'Male' in results["by_group"] and 'Female' in results["by_group"]:
            male_accuracy = results["by_group"].get('Male', 0)
            female_accuracy = results["by_group"].get('Female', 0)

            # If there's a significant accuracy gap
            if abs(male_accuracy - female_accuracy) > 0.05:  # Example threshold
                mitigation_advice = (
                    f"Significant accuracy difference detected. "
                    f"Male accuracy: {male_accuracy}, Female accuracy: {female_accuracy}. "
                    "Consider rebalancing the dataset or using fairness constraints during model training."
                )

        return jsonify({
            "success": True,
            "results": results,
            "mitigation_advice": mitigation_advice
        }), 200

    except Exception as e:
        print("Exception occurred:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)


