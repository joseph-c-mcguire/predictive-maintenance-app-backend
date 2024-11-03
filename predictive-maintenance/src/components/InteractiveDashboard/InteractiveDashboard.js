import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './InteractiveDashboard.css'; // Import the CSS file

const InteractiveDashboard = () => {
	const [data, setData] = useState([]);
	const [xVariable, setXVariable] = useState('Air temperature [K]');
	const [yVariable, setYVariable] = useState('Process temperature [K]');
	const [colorVariable, setColorVariable] = useState('Type');
	const [plotType, setPlotType] = useState('scatter');

	// Load data from API
	useEffect(() => {
		axios.get(`${process.env.REACT_APP_BACKEND_URL}/data`)
			.then(response => {
				setData(response.data);
			})
			.catch(error => {
				console.error('Error fetching data:', error);
			});
	}, []);

	const handleXChange = (event) => {
		setXVariable(event.target.value);
	};

	const handleYChange = (event) => {
		setYVariable(event.target.value);
	};

	const handleColorChange = (event) => {
		setColorVariable(event.target.value);
	};

	const handlePlotTypeChange = (event) => {
		setPlotType(event.target.value);
	};

	return (
		<div className="dashboard-card">
			<h2>Interactive Dashboard</h2>
			<div className="controls">
				<label>
					X-axis:
					<select value={xVariable} onChange={handleXChange}>
						<option value="Air temperature [K]">Air temperature [K]</option>
						<option value="Process temperature [K]">Process temperature [K]</option>
						<option value="Rotational speed [rpm]">Rotational speed [rpm]</option>
						<option value="Torque [Nm]">Torque [Nm]</option>
						<option value="Tool wear [min]">Tool wear [min]</option>
					</select>
				</label>
				<label>
					Y-axis:
					<select value={yVariable} onChange={handleYChange}>
						<option value="Air temperature [K]">Air temperature [K]</option>
						<option value="Process temperature [K]">Process temperature [K]</option>
						<option value="Rotational speed [rpm]">Rotational speed [rpm]</option>
						<option value="Torque [Nm]">Torque [Nm]</option>
						<option value="Tool wear [min]">Tool wear [min]</option>
					</select>
				</label>
				<label>
					Color by:
					<select value={colorVariable} onChange={handleColorChange}>
						<option value="Type">Type</option>
					</select>
				</label>
				<label>
					Plot type:
					<select value={plotType} onChange={handlePlotTypeChange}>
						<option value="scatter">Scatter</option>
						<option value="bar">Bar</option>
					</select>
				</label>
			</div>
			<div className="plot-container">
				<Plot
					data={[
						{
							x: data.map(d => d[xVariable]),
							y: data.map(d => d[yVariable]),
							type: plotType,
							mode: plotType === 'scatter' ? 'markers' : undefined,
							marker: { 
								color: data.map(d => d[colorVariable]),
								colorscale: 'Viridis', // Choose a colorscale
								showscale: true,
								colorbar: {
									title: 'Type', // Title for the colorbar
								},
							},
							name: 'Data Points', // Name for the legend
						},
					]}
					layout={{
						title: 'Interactive Dashboard Plot',
						xaxis: {
							title: xVariable, // Label for the x-axis
						},
						yaxis: {
							title: yVariable, // Label for the y-axis
						},
						legend: {
							x: 1,
							y: 1,
							traceorder: 'normal',
							font: {
								family: 'sans-serif',
								size: 12,
								color: '#000',
							},
							bgcolor: '#E2E2E2',
							bordercolor: '#FFFFFF',
							borderwidth: 2,
						},
					}}
				/>
			</div>
		</div>
	);
};

export default InteractiveDashboard;
