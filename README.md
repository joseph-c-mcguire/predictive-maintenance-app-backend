# Predictive Maintenance System

A predictive maintenance system for industrial equipment using machine learning.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Running Unit Tests](#running-unit-tests)
- [Running with Docker-compose](#running-with-docker-compose)  <!-- Added new section to Table of Contents -->
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project aims to predict failures in industrial equipment using machine learning models. The system is built using Python for the back-end and React for the front-end.

## Project Structure

The project is divided into two main parts:

1. **Back-end**: Contains the machine learning models and APIs.
2. **Front-end**: Contains the user interface for interacting with the system.

### Back-end

The back-end is built using Python and includes the following components:

- **Data Preprocessing**: Scripts for cleaning and preparing the data.
- **Model Training**: Scripts for training machine learning models.
- **API**: Flask-based API for serving predictions.

### Front-end

The front-end is built using React and includes the following components:

- **Dashboard**: Main interface for users to interact with the system.
- **Results**: Component for displaying prediction results.

## Installation

To install the project, clone the repository and install the dependencies for both the front-end and back-end.

### Back-end Installation
```sh
git clone https://github.com/yourusername/predictive-maintenance-scikit-learn-example.git
cd predictive-maintenance-scikit-learn-example
pip install .
```
Make sure to replace `yourusername` with your actual GitHub username in the clone URL. This structure provides a clear and concise overview of your project, making it easier for others to understand and contribute.

### Front-end Installation
```sh
cd frontend
npm install
```

## Running the Project

To run the back-end:
```sh
python main.py --config config.yaml
```

To run the front-end:
```sh
cd frontend
npm start
```

## Running Unit Tests

To run the tests for the back-end, use the following command:
```sh
pytest --cov=src --cov-report=xml
```

To run the tests for the front-end, use the following command:
```sh
cd frontend
npm test
```

## Running with Docker-compose

To run the project using Docker-compose, use the following command:
```sh
docker-compose up
```

## License

This project is licensed under the BSD 3-Clause License. See the LICENSE file for details.
