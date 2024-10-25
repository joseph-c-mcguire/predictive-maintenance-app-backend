
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import shap
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, roc_auc_score

from yaml import load, Loader

# Load the configuration file


def load_config(file_path):
    """
    Load the configuration file from a YAML file.

    Parameters:
    file_path (str): Path to the YAML file.

    Returns:
    dict: Loaded configuration.
    """
    with open(file_path, 'r') as file:
        config = load(file, Loader=Loader)
    return config

# Load the dataset


def load_data(file_path):
    """
    Load the dataset from a CSV file.

    Parameters:
    file_path (str): Path to the CSV file.

    Returns:
    pd.DataFrame: Loaded dataset.
    """
    data = pd.read_csv(file_path)
    return data


def preprocess_data(data, columns_to_drop: list[str] = list(), columns_to_scale: list[str] = list(), columns_to_encode: list[str] = list()):
    """
    Preprocess the dataset: handle missing values, outliers, and normalize the data.

    Parameters:
    data (pd.DataFrame): Raw dataset.
    columns_to_drop (list[str], optional): List of columns to drop from the dataset. Defaults to None.
    columns_to_scale (list[str], optional): List of columns to scale/normalize. Defaults to None.
    columns_to_encode (list[str], optional): List of columns to encode (e.g., categorical columns). Defaults to None.

    Returns:
    pd.DataFrame: Preprocessed dataset.
    """
    # Create a column transformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('drop_columns', 'drop', columns_to_drop),
            ('scale_columns', StandardScaler(), columns_to_scale),
            ('encode_columns', OneHotEncoder(), columns_to_encode)
        ]
    )
    # Fit the column transformer
    scaled_data = preprocessor.fit_transform(data)

    return preprocessor, scaled_data


def perform_eda(data):
    """
    Perform exploratory data analysis on the dataset.

    Parameters:
    data (pd.DataFrame): Preprocessed dataset.

    Returns:
    None
    """
    # Plot histograms for each feature
    data.hist(bins=50, figsize=(20, 15))
    plt.show()

    # Plot heatmap of feature correlations
    plt.figure(figsize=(12, 8))
    sns.heatmap(data.corr(), annot=True, cmap='coolwarm')
    plt.show()


def select_features(X, y, preprocessor: ColumnTransformer) -> list[str]:
    """
    Select the most relevant features using a Random Forest model.

    Parameters:
    data (pd.DataFrame): Preprocessed dataset.

    Returns:
    list: Selected features.
    """
    # X = data.drop('failure', axis=1)
    # y = data['failure']
    processed_data = preprocessor.fit_transform(X)
    model = RandomForestClassifier()
    model.fit(processed_data, y)

    # Get feature importances
    selected_features = get_top_n_indices(model.feature_importances_)
    return selected_features


def train_and_evaluate_model(X_train: np.ndarray, y_train: np.ndarray, X_test: np.ndarray, y_test: np.ndarray) -> dict:
    """
    Train and evaluate multiple machine learning models.

    Parameters:
    data (pd.DataFrame): Preprocessed dataset.
    selected_features (list): List of selected features.

    Returns:
    dict: Model evaluation results.
    """
    models = {
        'Logistic Regression': LogisticRegression(),
        'Decision Tree': DecisionTreeClassifier(),
        'Random Forest': RandomForestClassifier(),
        'Gradient Boosting': GradientBoostingClassifier(),
        'SVM': SVC(probability=True)
    }

    results = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]

        results[name] = {
            'Classification Report': classification_report(y_test, y_pred),
            'ROC AUC': roc_auc_score(y_test, y_proba)
        }

    return results


def tune_model(model, param_grid, X_train, y_train):
    """
    Perform hyperparameter tuning using GridSearchCV.

    Parameters:
    model (sklearn estimator): The machine learning model to be tuned.
    param_grid (dict): Hyperparameter grid.
    X_train (pd.DataFrame): Training features.
    y_train (pd.Series): Training target.

    Returns:
    GridSearchCV: Best estimator after hyperparameter tuning.
    """
    grid_search = GridSearchCV(
        estimator=model, param_grid=param_grid, cv=5, scoring='roc_auc', n_jobs=-1)
    grid_search.fit(X_train, y_train)

    return grid_search.best_estimator_


def interpret_model(model, X):
    """
    Interpret the machine learning model using SHAP values.

    Parameters:
    model (sklearn estimator): Trained machine learning model.
    X (pd.DataFrame): Features for interpretation.

    Returns:
    None
    """
    explainer = shap.Explainer(model)
    shap_values = explainer(X)

    # Summary plot
    shap.summary_plot(shap_values, X)


def monitor_model_performance(model, X, y):
    """
    Monitor the performance of the deployed model.

    Parameters:
    model (sklearn estimator): Trained machine learning model.
    X (pd.DataFrame): Features.
    y (pd.Series): Target variable.

    Returns:
    float: ROC AUC score of the model on new data.
    """
    y_proba = model.predict_proba(X)[:, 1]
    roc_auc = roc_auc_score(y, y_proba)

    return roc_auc


def get_top_n_indices(arr, n=10):
    """
    Get the indices of the n largest elements from a numpy array.

    Parameters:
    arr (numpy.ndarray): Input array.
    n (int): Number of top elements to retrieve indices for. Defaults to 10.

    Returns:
    numpy.ndarray: Array of indices of the n largest elements.
    """
    if n >= len(arr):
        return np.argsort(arr)[-n:][::-1]

    # Get the indices that would sort the array
    sorted_indices = np.argsort(arr)
    # Select the last n indices and reverse them
    top_n_indices = sorted_indices[-n:][::-1]

    return top_n_indices
