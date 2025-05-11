// Placeholder for Bayesian Optimization Demo Logic
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bayesianOptimizationChart');
    if (!canvas) {
        console.error('Bayesian optimization chart canvas not found.');
        return;
    }
    const ctx = canvas.getContext('2d');
    const addSamplePointButton = document.getElementById('addSamplePoint');
    const iterationCountSpan = document.getElementById('iterationCount');
    const bestValueSpan = document.getElementById('bestValue');
    const bestXSpan = document.getElementById('bestX');
    const acquisitionFunctionSelectEl = document.getElementById('acquisitionFunctionSelect');
    const resetDemoButtonEl = document.getElementById('resetDemoButton');

    if (!addSamplePointButton || !iterationCountSpan || !bestValueSpan || !bestXSpan) {
        console.error('One or more UI elements for Bayesian optimization demo not found.');
        return;
    }

    let iteration = 0;
    let sampledPoints = [];
    let bestVal = -Infinity;
    let bestX = null;
    let currentAcquisitionFunction = 'UCB';

    // --- Configuration ---
    const xMin = 0;
    const xMax = 10;
    const numPoints = 100; // Number of points to plot for functions
    const noiseLevel = 0.1;

    // --- True Black-Box Function (Forrester et al. 2008, scaled and shifted) ---
    // Original: f(s_x) = (6*s_x - 2)^2 * sin(12*s_x - 4) for s_x in [0, 1]
    // Output range of original: approx [-6, 16]
    // Our x is in [0, 10]. Scaled s_x = x / 10.
    // Transformed output to fit [0, 7] for visualization: (y_raw + 6) * (7 / 22)
    function trueFunction(x) {
        const s_x = x / 10; // Scale x from [0, 10] to [0, 1]
        if (s_x < 0 || s_x > 1) { 
            // Behavior outside [0,1] for s_x, though our plotting domain should keep it within.
            // Return a relatively neutral value or handle as an error/boundary condition.
            // For plotting, this might not be hit if x_labels are strictly within [0,10].
            return 2.5; // Mid-point of transformed range, or handle differently
        }
        const term1 = Math.pow((6 * s_x - 2), 2);
        const term2 = Math.sin(12 * s_x - 3);
        const y_raw = term1 * term2;
        
        // Transform to approx [0, 7] to fit y-axis [-1, 10]
        const y_transformed = (y_raw + 6) * (7 / 22);
        return y_transformed;
    }

    // --- Gaussian Process Model (Simplified) ---
    // For a simple demo, we'll just plot the sampled points and a conceptual mean/variance.
    // A full GP implementation is complex. Here, we'll use a kernel (RBF) for illustration.

    function rbfKernel(x1, x2, lengthScale = 1.0, variance = 1.0) {
        return variance * Math.exp(-0.5 * Math.pow((x1 - x2) / lengthScale, 2));
    }

    function predictGP(x, sampledPoints, lengthScale = 1.0, signalVariance = 1.0, noiseVariance = noiseLevel * noiseLevel) {
        if (sampledPoints.length === 0) {
            return { mean: 2.5, variance: signalVariance }; // Prior mean and variance
        }

        const K_xs_s = sampledPoints.map(p => rbfKernel(x, p.x, lengthScale, signalVariance));
        const K_s_s = sampledPoints.map((p1, i) => 
            sampledPoints.map((p2, j) => rbfKernel(p1.x, p2.x, lengthScale, signalVariance) + (i === j ? noiseVariance : 0))
        );

        // Simple inversion for 1x1 or 2x2, otherwise needs a library or more complex code
        // This is a placeholder and not a robust matrix inversion.
        // For a real GP, you'd use a linear algebra library (e.g., math.js, though not included by default).
        // For simplicity, we'll use a weighted average approach if K_s_s inversion is too complex here.
        
        // Simplified prediction: weighted average of observed points based on kernel similarity
        let weightedSum = 0;
        let kernelSum = 0;
        sampledPoints.forEach(p => {
            const k = rbfKernel(x, p.x, lengthScale, signalVariance);
            weightedSum += k * p.y;
            kernelSum += k;
        });
        const mean = kernelSum > 0 ? weightedSum / kernelSum : 2.5; // Fallback to prior mean

        // Variance: for simplicity, make it decrease near sampled points
        let minDistance = Infinity;
        sampledPoints.forEach(p => {
            minDistance = Math.min(minDistance, Math.abs(x - p.x));
        });
        const variance = signalVariance * (1 - Math.exp(-0.5 * Math.pow(minDistance / lengthScale, 2))) + noiseVariance;

        return { mean, variance };
    }

    // --- Standard Normal PDF (phi) ---
    function phi(x) {
        return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    }

    // --- Standard Normal CDF (Phi) - Abramowitz and Stegun approximation 26.2.17 ---
    function Phi(x) {
        const p  =  0.2316419;
        const b1 =  0.319381530;
        const b2 = -0.356563782;
        const b3 =  1.781477937;
        const b4 = -1.821255978;
        const b5 =  1.330274429;
        
        const t = 1 / (1 + p * Math.abs(x));
        const Z_pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x); // phi(x)
        const y = 1 - Z_pdf * (b1 * t + b2 * Math.pow(t, 2) + b3 * Math.pow(t, 3) + b4 * Math.pow(t, 4) + b5 * Math.pow(t, 5));
        
        return x >= 0 ? y : 1 - y;
    }
    
    // --- Gaussian Random Number Generator (Box-Muller transform) ---
    let _z1_gauss = null; 
    function gaussianRandom() {
        if (_z1_gauss !== null) {
            const result = _z1_gauss;
            _z1_gauss = null;
            return result;
        }
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = Math.random(); // Exclude 0 for log
        while (u2 === 0) u2 = Math.random();
        const R = Math.sqrt(-2.0 * Math.log(u1));
        const Theta = 2.0 * Math.PI * u2;
        _z1_gauss = R * Math.sin(Theta);
        return R * Math.cos(Theta);
    }

    // --- Acquisition Functions ---
    // UCB (already exists, ensure kappa is defined or passed if configurable)
    function ucb(mean, variance, kappa = 1.96) { // kappa ~1.96 for 95% confidence
        return mean + kappa * Math.sqrt(variance);
    }

    function expectedImprovement(mean, variance, bestYSoFar, xi = 0.01) {
        if (variance <= 0) return 0; // Variance must be positive
        const stdDev = Math.sqrt(variance);
        if (stdDev === 0) return 0; // Avoid division by zero and handle no uncertainty

        const Z = (mean - bestYSoFar - xi) / stdDev;
        const ei = (mean - bestYSoFar - xi) * Phi(Z) + stdDev * phi(Z);
        return ei > 0 ? ei : 0; // EI must be non-negative
    }

    function thompsonSampling(mean, variance) {
        if (variance < 0) variance = 0; // Ensure non-negative variance before sqrt
        const stdDev = Math.sqrt(variance);
        return mean + gaussianRandom() * stdDev;
    }

    function calculateAcquisitionValue(type, mean, variance, bestY, kappa = 1.96, xi = 0.01) {
        switch (type) {
            case 'EI':
                return expectedImprovement(mean, variance, bestY, xi);
            case 'TS':
                return thompsonSampling(mean, variance);
            case 'UCB':
            default:
                return ucb(mean, variance, kappa);
        }
    }

    // --- Chart.js Setup ---
    const chartData = {
        labels: Array.from({ length: numPoints }, (_, i) => xMin + (i * (xMax - xMin)) / (numPoints - 1)),
        datasets: [
            {
                label: 'Ground truth',
                data: [], // Filled by plotFunctions
                borderColor: 'rgba(255, 99, 132, 0.7)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1,
                hidden: false, // Initially hidden -> now false
            },
            {
                label: 'GP mean',
                data: [], // Filled by plotFunctions
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1,
            },
            {
                label: 'GP confidence interval',
                data: [], // Filled by plotFunctions for upper bound
                borderColor: 'rgba(54, 162, 235, 0.3)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 1,
                pointRadius: 0,
                fill: '+1', // Fill to next dataset (lower bound)
                tension: 0.1,
            },
            {
                label: 'GP Confidence Interval (lower)', // Helper for fill
                data: [], // Filled by plotFunctions for lower bound
                borderColor: 'rgba(54, 162, 235, 0.3)',
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
                tension: 0.1,
            },
            {
                label: `Acquisition function (${currentAcquisitionFunction.toUpperCase()})`,
                data: [], // Filled by plotFunctions
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1,
                yAxisID: 'yAcquisition',
            },
            {
                label: 'Sampled points',
                data: [], // {x, y} objects
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 5,
                pointHoverRadius: 7,
                showLine: false,
                type: 'scatter',
            },
        ],
    };

    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Disable animations
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'x',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'f(x)',
                    },
                    min: -2,
                    max: 8
                },
                yAcquisition: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Acquisition value',
                    },
                    grid: {
                        drawOnChartArea: false, // Only display grid for this axis
                    },
                    min: -2,
                    max: 8
                },
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
                legend: {
                    position: 'top',
                    labels: {
                        filter: function(legendItem, chartData) {
                            // Dataset index 3 is 'GP Confidence Interval (Lower)'
                            // Dataset index 5 is 'Sampled points'
                            if (legendItem.datasetIndex === 3 || legendItem.datasetIndex === 5) {
                                return false; // Don't show these in legend
                            }
                            return true;
                        }
                    }
                }
            }
        },
    };

    const bayesianChart = new Chart(ctx, chartConfig);

    // --- Helper Functions ---
    function plotFunctions() {
        const xValues = chartData.labels;
        const trueFuncValues = xValues.map(x => trueFunction(x));
        const gpMeanValues = [];
        const gpUpperValues = [];
        const gpLowerValues = [];
        const acqValues = [];

        xValues.forEach(x => {
            const { mean, variance } = predictGP(x, sampledPoints);
            const stdDev = Math.sqrt(variance > 0 ? variance : 0);
            gpMeanValues.push(mean);
            gpUpperValues.push(mean + 1.96 * stdDev);
            gpLowerValues.push(mean - 1.96 * stdDev);
            const acqValue = calculateAcquisitionValue(currentAcquisitionFunction, mean, variance, bestVal);
            acqValues.push(acqValue);
        });

        bayesianChart.data.datasets[0].data = trueFuncValues;
        bayesianChart.data.datasets[1].data = gpMeanValues;
        bayesianChart.data.datasets[2].data = gpUpperValues; // Upper CI
        bayesianChart.data.datasets[3].data = gpLowerValues; // Lower CI (for fill)
        bayesianChart.data.datasets[4].data = acqValues;
        bayesianChart.data.datasets[5].data = sampledPoints.map(p => ({x: p.x, y: p.y}));
        bayesianChart.update();
    }

    function resetDemo() {
        iteration = 0;
        sampledPoints = [];
        bestVal = -Infinity;
        bestX = null;

        if (iterationCountSpan) iterationCountSpan.textContent = iteration;
        if (bestValueSpan) bestValueSpan.textContent = 'N/A';
        if (bestXSpan) bestXSpan.textContent = 'N/A';
        
        plotFunctions(); // Redraw the chart in its initial state
    }

    function findNextSamplePoint() {
        const xValues = chartData.labels;
        let maxAcqValue = -Infinity;
        let nextX = xValues[0];

        xValues.forEach(x => {
            const { mean, variance } = predictGP(x, sampledPoints);
            const acqValue = calculateAcquisitionValue(currentAcquisitionFunction, mean, variance, bestVal);
            if (acqValue > maxAcqValue) {
                maxAcqValue = acqValue;
                nextX = x;
            }
        });
        return nextX;
    }

    function addSample(x) {
        const y = trueFunction(x) + (Math.random() - 0.5) * 2 * noiseLevel; // Add some noise
        sampledPoints.push({ x, y });
        sampledPoints.sort((a, b) => a.x - b.x); // Keep sorted for easier processing

        if (y > bestVal) {
            bestVal = y;
            bestX = x;
        }

        iteration++;
        iterationCountSpan.textContent = iteration;
        bestValueSpan.textContent = bestVal.toFixed(3);
        bestXSpan.textContent = bestX.toFixed(3);

        plotFunctions();
    }

    // --- Event Listener ---
    addSamplePointButton.addEventListener('click', () => {
        const nextXToSample = findNextSamplePoint();
        addSample(nextXToSample);
    });

    // Add event listener for the acquisition function selector
    if (acquisitionFunctionSelectEl) {
        acquisitionFunctionSelectEl.addEventListener('change', (event) => {
            currentAcquisitionFunction = event.target.value;
            bayesianChart.data.datasets[4].label = `Acquisition Function (${currentAcquisitionFunction.toUpperCase()})`; // Update legend

            // Dynamically adjust y-axis for the acquisition function
            if (currentAcquisitionFunction === 'EI') {
                bayesianChart.options.scales.yAcquisition.min = -0.05; // Adjusted for EI visibility
                bayesianChart.options.scales.yAcquisition.max = 1.0;   // Adjusted for EI visibility
            } else { // For UCB, TS, or any other types
                bayesianChart.options.scales.yAcquisition.min = -2; // Default scale
                bayesianChart.options.scales.yAcquisition.max = 8;  // Default scale
            }

            plotFunctions(); // Re-plot based on new acquisition function and new axis scale (update is inside)
        });
    } else {
        console.warn('Acquisition function select element not found. Add an HTML select with id="acquisitionFunctionSelect".');
    }

    // Add event listener for the reset button
    if (resetDemoButtonEl) {
        resetDemoButtonEl.addEventListener('click', resetDemo);
    } else {
        console.warn('Reset demo button element not found. Add an HTML button with id="resetDemoButton".');
    }

    // --- Initial Plot ---
    plotFunctions(); // Call plotFunctions to draw the initial empty state with correct axes
});