document.addEventListener('DOMContentLoaded', () => {
    let chart = null;
    let allTransactions = [];
    let currentChartType = 'bar';

    // Enhanced color palette
    const colorPalette = [
        '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
        '#9b59b6', '#1abc9c', '#d35400', '#34495e',
        '#16a085', '#c0392b', '#8e44ad', '#27ae60'
    ];

    // Get DOM elements
    const graphCanvas = document.getElementById('graphCanvas');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    graphCanvas.parentElement.appendChild(loadingOverlay);

    // Create chart type toggle
    const chartTypeToggle = document.createElement('div');
    chartTypeToggle.className = 'chart-type-toggle';
    chartTypeToggle.innerHTML = `
        <button class="chart-type-btn active" data-type="bar">Bar Chart</button>
        <button class="chart-type-btn" data-type="pie">Pie Chart</button>
    `;
    document.querySelector('#charts').insertBefore(chartTypeToggle, graphCanvas.parentElement);

    // Create year filter
    const yearFilter = document.createElement('select');
    yearFilter.id = 'yearFilter';
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.innerHTML = '<label for="yearFilter">Select Time Period:</label>';
    filterContainer.appendChild(yearFilter);
    document.querySelector('#charts').insertBefore(filterContainer, chartTypeToggle);

    // Show loading initially
    loadingOverlay.style.display = 'flex';

    // Fetch data with enhanced error handling
    fetch('http://127.0.0.1:5000/api/transactions')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            allTransactions = data;
            console.log('All transactions:', allTransactions);
            loadingOverlay.style.display = 'none';
            
            // Process categories to ensure they're valid strings
            allTransactions.forEach(t => {
                t.type = t.category || 'Unknown'; // Ensure we use the category field
                if (typeof t.type !== 'string') {
                    t.type = String(t.type);
                }
            });
            
            // Get unique years with actual data
            const yearsWithData = getYearsWithData(allTransactions);
            populateYearFilter(yearsWithData);
            
            renderChart();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            loadingOverlay.style.display = 'none';
            graphCanvas.style.display = 'none';
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'no-data-message';
            errorMessage.innerHTML = `
                <div class="no-data-icon">⚠️</div>
                <div class="no-data-text">Error Loading Data</div>
                <div class="no-data-subtext">Please check your connection and try again</div>
            `;
            graphCanvas.parentElement.appendChild(errorMessage);
        });

    function getYearsWithData(transactions) {
        const years = new Set();
        transactions.forEach(t => {
            try {
                const date = new Date(t.date);
                if (!isNaN(date.getTime())) {
                    years.add(date.getFullYear());
                }
            } catch {
                // Skip invalid dates
            }
        });
        return Array.from(years).sort();
    }

    function populateYearFilter(years) {
        yearFilter.innerHTML = '<option value="all">All Time</option>';
        
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        if (years.length > 0) {
            yearFilter.value = Math.max(...years);
        }
    }

    yearFilter.addEventListener('change', () => {
        renderChart();
    });

    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentChartType = btn.dataset.type;
            renderChart();
        });
    });

    function renderChart() {
        const ctx = graphCanvas.getContext('2d');
        const selectedYear = yearFilter.value;

        if (chart) {
            chart.destroy();
            chart = null;
        }

        // Filter data by selected year
        let filteredData = allTransactions;
        if (selectedYear !== 'all') {
            const year = parseInt(selectedYear);
            filteredData = allTransactions.filter(t => {
                try {
                    const date = new Date(t.date);
                    return !isNaN(date.getTime()) && date.getFullYear() === year;
                } catch {
                    return false;
                }
            });
        }

        // Group by category and sum amounts
        const categoryMap = {};
        filteredData.forEach(t => {
            const category = t.type || 'Unknown';
            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }
            categoryMap[category] += t.amount;
        });

        // Convert to arrays for Chart.js
        const categories = Object.keys(categoryMap).filter(c => c !== 'undefined');
        const amounts = categories.map(c => categoryMap[c]);

        if (categories.length === 0) {
            graphCanvas.style.display = 'none';
            const noDataMessage = document.createElement('div');
            noDataMessage.className = 'no-data-message';
            noDataMessage.innerHTML = `
                <div class="no-data-icon">📊</div>
                <div class="no-data-text">No Data Available</div>
                <div class="no-data-subtext">Try selecting a different time period</div>
            `;
            graphCanvas.parentElement.appendChild(noDataMessage);
            return;
        }

        graphCanvas.style.display = 'block';
        const existingMessages = document.querySelectorAll('.no-data-message');
        existingMessages.forEach(msg => msg.remove());

        const chartData = {
            labels: categories,
            datasets: [{
                label: 'Total Amount (RWF)',
                data: amounts,
                backgroundColor: colorPalette.slice(0, categories.length),
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        };

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 12,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        color: '#2c3e50',
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toLocaleString()} RWF`;
                        }
                    }
                }
            }
        };

        if (currentChartType === 'bar') {
            chart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    ...commonOptions,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Transaction Categories',
                                font: {
                                    size: 14,
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                                },
                                color: '#2c3e50'
                            },
                            ticks: {
                                font: {
                                    size: 12,
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                                },
                                color: '#2c3e50',
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Total Amount (RWF)',
                                font: {
                                    size: 14,
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                                },
                                color: '#2c3e50'
                            },
                            ticks: {
                                font: {
                                    size: 12,
                                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                                },
                                color: '#2c3e50',
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        tooltip: {
                            ...commonOptions.plugins.tooltip,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((context.raw / total) * 100);
                                    return `${context.label}: ${context.raw.toLocaleString()} RWF (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
});
