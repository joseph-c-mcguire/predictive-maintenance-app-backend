import React from 'react';

const DataDescription = () => {
  return (
    <div className="data-description-container">
      <h2>About Dataset</h2>
      <p>Machine Predictive Maintenance Classification Dataset</p>
      <p>
        Since real predictive maintenance datasets are generally difficult to obtain and in particular difficult to publish, we present and provide a synthetic dataset that reflects real predictive maintenance encountered in the industry to the best of our knowledge.
      </p>
      <p>The dataset consists of 10,000 data points stored as rows with 14 features in columns:</p>
      <ul>
        <li>UID: unique identifier ranging from 1 to 10000</li>
        <li>productID: consisting of a letter L, M, or H for low (50% of all products), medium (30%), and high (20%) as product quality variants and a variant-specific serial number</li>
        <li>air temperature [K]: generated using a random walk process later normalized to a standard deviation of 2 K around 300 K</li>
        <li>process temperature [K]: generated using a random walk process normalized to a standard deviation of 1 K, added to the air temperature plus 10 K</li>
        <li>rotational speed [rpm]: calculated from power of 2860 W, overlaid with a normally distributed noise</li>
        <li>torque [Nm]: torque values are normally distributed around 40 Nm with an σ = 10 Nm and no negative values</li>
        <li>tool wear [min]: The quality variants H/M/L add 5/3/2 minutes of tool wear to the used tool in the process</li>
        <li>machine failure: label that indicates whether the machine has failed in this particular data point for any of the following failure modes are true</li>
      </ul>
      <p>Important: There are two Targets - Do not make the mistake of using one of them as a feature, as it will lead to leakage.</p>
      <ul>
        <li>Target: Failure or Not</li>
        <li>Failure Type: Type of Failure</li>
      </ul>
      <p>Acknowledgements:</p>
      <ul>
        <li>UCI: <a href="https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset" target="_blank" rel="noopener noreferrer">UCI Dataset</a></li>
        <li>Kaggle: <a href="https://www.kaggle.com/datasets/shivamb/machine-predictive-maintenance-classification" target="_blank" rel="noopener noreferrer">Kaggle Dataset</a></li>
      </ul>
    </div>
  );
};

export default DataDescription;
