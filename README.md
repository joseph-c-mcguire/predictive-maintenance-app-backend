# Predictive Maintenance for Industrial Equipment

## Project Overview
This project aims to develop a predictive maintenance system for industrial equipment using machine learning techniques to predict equipment failures and optimize maintenance schedules.

## Steps to Complete the Project
1. Data Collection
2. Data Preprocessing
3. Exploratory Data Analysis (EDA)
4. Feature Selection
5. Model Development
6. Model Evaluation and Selection
7. Model Interpretation
8. Deployment
9. Monitoring and Maintenance
10. Documentation and Presentation

## How to Run the Code
1. Clone the repository.
   ```sh
   git clone https://github.com/yourusername/predictive-maintenance-scikit-learn-example.git
   cd predictive-maintenance-scikit-learn-example
   ```
2. Install Poetry (if not already installed).
    ```sh
    curl -sSL https://install.python-poetry.org | python3 -
    ```
3. Install the required packages using Poetry.
   ```sh
   poetry install
   ```
4. Run the main script.
```sh
poetry run python src/main.py
```
## How to Run the Code
1. Clone the repository.
2. Install the required packages: `pip install -r requirements.txt`
3. Run each script in order:
   - `data_collection.py`
   - `data_preprocessing.py`
   - `exploratory_data_analysis.py`
   - `feature_selection.py`
   - `model_development.py`
   - `model_selection.py`
   - `model_interpretation.py`
   - `deployment.py`
   - `monitoring.py`

## How to Run Unit Tests
1. Ensure you have pytest installed. If not, you can install it using Poetry:
```sh
poetry add --dev pytest
```
2. Run the tests using `pytest`:
```sh
poetry run pytest
```

## Repository Structure
- `data/`: Contains the dataset files.
- `src/`: Contains the source code for the project.
- `models/`: Contains the saved models.
- `tests/`: Contains the unit tests for the project.
- `README.md`: Project documentation.
- `pyproject.toml`: Project configuration file for Poetry.
## Configuration
The project uses a configuration file `config.yaml` to manage various settings. Ensure this file is correctly set up before running the scripts.

## Example Configuration (`config.yaml`)
```yaml
data_path: "data/predictive_maintenance.csv"
target_column: "failure"
columns_to_drop: ["unnecessary_column1", "unnecessary_column2"]
columns_to_scale: ["feature1", "feature2"]
columns_to_encode: ["categorical_feature1", "categorical_feature2"]
param_grid:
  n_estimators: [100, 200, 300]
  max_depth: [10, 20, 30]
model_directory: "models"
```
## License
This project is licensed under the BSD3-Clause License - see the LICENSE file for details

## Contact
For any questions or suggestions, please contact Joseph McGuire at joseph.c.mcg@gmail.com.

