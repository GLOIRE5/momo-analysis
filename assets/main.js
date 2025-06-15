document.addEventListener('DOMContentLoaded', () => {
    // Initialize data storage
    let transactionData = [];
    let activePage = 1;
    let visibleTransactions = [];
    const recordsPerPage = 50;

    // Cache DOM elements for efficiency
    const recordsDisplay = document.getElementById('recordsDisplay');
    const recordCount = document.getElementById('recordCount');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const navInfo = document.getElementById('navInfo');
    const queryInput = document.getElementById('query');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateSelector = document.getElementById('dateSelector');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadModal = document.getElementById('downloadModal');
    const downloadCategoryFilter = document.getElementById('downloadCategoryFilter');
    const downloadSummary = document.getElementById('downloadSummary');
    const pageSpanInputs = document.getElementById('pageSpanInputs');
    const entrySpanInputs = document.getElementById('entrySpanInputs');
    const startPageInput = document.getElementById('startPage');
    const endPageInput = document.getElementById('endPage');
    const startEntryInput = document.getElementById('startEntry');
    const endEntryInput = document.getElementById('endEntry');
    const proceedDownload = document.getElementById('proceedDownload');
    const abortDownload = document.getElementById('abortDownload');
    const exitModal = document.getElementById('exitModal');
    const downloadModeRadios = document.querySelectorAll('input[name="downloadMode"]');

    // Show loading message
    recordsDisplay.innerHTML = '<p>Fetching data...</p>';

    // Retrieve transactions from API
    fetch('http://127.0.0.1:5000/api/transactions')
        .then(response => {
            if (!response.ok) throw new Error(`API error: ${response.status} - ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format: Expected an array');
            }
            console.log('Received transaction data:', data);
            transactionData = data.map(record => ({
                type: record.category || 'Unknown',
                amount: record.amount || 0,
                date: record.date || '',
                sender: record.sender || 'Unknown',
                receiver: record.receiver || 'Unknown',
                description: record.details || 'N/A'
            }));
            populateCategoryFilters();
            visibleTransactions = refineData(false);
        })
        .catch(error => {
            console.error('Data fetch failed:', error);
            recordsDisplay.innerHTML = `<p>Data load failed: ${error.message}. Please check server logs and retry.</p>`;
            recordCount.textContent = 'No records found';
        });

    // Populate both category filter dropdowns
    function populateCategoryFilters() {
        const categories = [...new Set(transactionData.map(record => record.type))];
        categories.sort();
        
        console.log('Available categories:', categories);

        const populateSelect = (selectElement) => {
            selectElement.innerHTML = '';
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'All Categories';
            selectElement.appendChild(defaultOption);
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                selectElement.appendChild(option);
            });
        };

        populateSelect(categoryFilter);
        populateSelect(downloadCategoryFilter);
    }

    // Filter and sort transactions
    function refineData(resetPage = true) {
        const queryText = queryInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedDate = dateSelector.value;

        visibleTransactions = transactionData.filter(record => {
            const type = (record.type || '').toLowerCase();
            const description = (record.description || '').toLowerCase();
            const matchesQuery = type.includes(queryText) || description.includes(queryText);
            const matchesCategory = !selectedCategory || record.type === selectedCategory;
            const matchesDate = !selectedDate || record.date === selectedDate;
            return matchesQuery && matchesCategory && matchesDate;
        });

        visibleTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (resetPage) {
            activePage = 1;
        }
        
        updateNavigator();
        showRecords();
        return visibleTransactions;
    }

    // Render transaction records
    function showRecords() {
        const startIndex = (activePage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const pageRecords = visibleTransactions.slice(startIndex, endIndex);

        if (pageRecords.length === 0) {
            recordsDisplay.innerHTML = '<p>No records found.</p>';
            recordCount.textContent = 'No records found';
            return;
        }

        let output = '<ul class="record-list">';
        pageRecords.forEach(record => {
            output += `
            <li class="record-item" 
                data-record='${JSON.stringify(record)}'>
                <strong>${record.type}</strong><br>
                Amount: ${record.amount} RWF<br>
                <span class="hidden-details">
                    Date: ${record.date}<br>
                    ${record.sender !== 'Unknown' ? `From: ${record.sender}<br>` : ''}
                    ${record.receiver !== 'Unknown' ? `To: ${record.receiver}<br>` : ''}
                    Description: ${record.description || 'N/A'}
                </span>
                <button class="expand-btn">▶</button>
            </li>`;
        });
        output += '</ul>';
        recordsDisplay.innerHTML = output;

        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const details = this.parentElement.querySelector('.hidden-details');
                const isShown = details.style.display === 'block';
                details.style.display = isShown ? 'none' : 'block';
                this.textContent = isShown ? '▶' : '▼';
            });
        });

        recordCount.textContent = `${visibleTransactions.length} records found`;
    }

    // Navigate between pages
    function navigatePage(step) {
        const totalPages = Math.ceil(visibleTransactions.length / recordsPerPage);
        activePage = Math.max(1, Math.min(activePage + step, totalPages));
        showRecords();
        updateNavigator();
    }

    // Update navigation info
    function updateNavigator() {
        const totalRecords = visibleTransactions.length;
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        const startRecord = (activePage - 1) * recordsPerPage + 1;
        const endRecord = Math.min(activePage * recordsPerPage, totalRecords);
        
        navInfo.textContent = `Segment ${activePage} of ${totalPages} (${startRecord}-${endRecord}/${totalRecords} records)`;
        backBtn.disabled = activePage === 1;
        forwardBtn.disabled = activePage === totalPages || totalRecords === 0;
    }

    // Refresh export summary
    function refreshDownloadSummary() {
        const selectedCategory = downloadCategoryFilter.value;
        let exportRecords = visibleTransactions;
        if (selectedCategory) {
            exportRecords = visibleTransactions.filter(t => t.type === selectedCategory);
        }
        const totalRecords = exportRecords.length;
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        downloadSummary.textContent = `Selected: ${selectedCategory || 'All Categories'} (${totalRecords} records, ${totalPages} segments)`;
    }

    // Handle record click for details
    recordsDisplay.addEventListener('click', (e) => {
        const item = e.target.closest('li.record-item');
        if (item && !e.target.classList.contains('expand-btn')) {
            try {
                const record = JSON.parse(item.getAttribute('data-record'));
                showDetailedRecord(record);
            } catch (error) {
                console.error('Record parse error:', error);
            }
        }
    });

    // Display detailed record panel
    function showDetailedRecord(record) {
        hideDetailedRecord();
        
        const panel = document.createElement('div');
        panel.id = 'recordPanel';
        panel.className = 'modal-panel';
        
        panel.innerHTML = `
            <h3>Record Details</h3>
            <p><strong>Category:</strong> ${record.type}</p>
            <p><strong>Amount:</strong> ${record.amount} RWF</p>
            <p><strong>Date:</strong> ${record.date}</p>
            <p><strong>Sender:</strong> ${record.sender || 'N/A'}</p>
            <p><strong>Receiver:</strong> ${record.receiver || 'N/A'}</p>
            <p><strong>Details:</strong> ${record.description || 'N/A'}</p>
            <button onclick="hideDetailedRecord()">Close</button>
        `;
        document.body.appendChild(panel);
    }

    // Close detailed panel on outside click
    document.addEventListener('click', (e) => {
        if (e.target.id !== 'recordPanel' && !e.target.closest('#recordPanel') && !e.target.closest('.record-item')) {
            hideDetailedRecord();
        }
    });

    // Export records to CSV
    function saveAsCSV() {
        const selectedCategory = downloadCategoryFilter.value;
        const mode = document.querySelector('input[name="downloadMode"]:checked').value;
        let exportRecords = selectedCategory
            ? visibleTransactions.filter(t => t.type === selectedCategory)
            : visibleTransactions;
        const totalRecords = exportRecords.length;
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        let startIndex, endIndex;
        if (mode === 'page') {
            const startPage = parseInt(startPageInput.value) || 1;
            const endPage = parseInt(endPageInput.value) || 1;
            if (isNaN(startPage) || startPage < 1) {
                alert(`Start page must be 1 or greater.`);
                return;
            }
            if (isNaN(endPage) || endPage < startPage) {
                alert(`End page must be ${startPage} or greater.`);
                return;
            }
            if (endPage > totalPages) {
                alert(`End page exceeds available segments (${totalPages}) for ${selectedCategory || 'All Categories'}.`);
                return;
            }
            startIndex = (startPage - 1) * recordsPerPage;
            endIndex = endPage * recordsPerPage;
        } else {
            const startEntry = parseInt(startEntryInput.value) || 1;
            const endEntry = parseInt(endEntryInput.value) || 1;
            if (isNaN(startEntry) || startEntry < 1) {
                alert(`Start entry must be 1 or greater.`);
                return;
            }
            if (isNaN(endEntry) || endEntry < startEntry) {
                alert(`End entry must be ${startEntry} or greater.`);
                return;
            }
            if (endEntry > totalRecords) {
                alert(`End entry exceeds total records (${totalRecords}) for ${selectedCategory || 'All Categories'}.`);
                return;
            }
            startIndex = startEntry - 1;
            endIndex = endEntry;
        }

        exportRecords = exportRecords.slice(startIndex, endIndex);

        if (exportRecords.length === 0) {
            alert(`No records to export for ${selectedCategory || 'All Categories'} in selected range.`);
            return;
        }

        // Generate CSV
        const headers = ['Category', 'Amount', 'Date', 'Sender', 'Receiver', 'Details'];
        const csvRows = [headers.join(',')];
        exportRecords.forEach(t => {
            const row = [
                `"${(t.type || '').replace(/"/g, '""')}"`,
                t.amount || 0,
                `"${t.date || ''}"`,
                `"${(t.sender || 'N/A').replace(/"/g, '""')}"`,
                `"${(t.receiver || 'N/A').replace(/"/g, '""')}"`,
                `"${(t.description || 'N/A').replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = mode === 'page'
            ? `records_segment_${startPageInput.value}_to_${endPageInput.value}.csv`
            : `records_entry_${startEntryInput.value}_to_${endEntryInput.value}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);

        downloadModal.style.display = 'none';
    }

    // Global function to hide detailed record
    window.hideDetailedRecord = function() {
        const panel = document.getElementById('recordPanel');
        if (panel) panel.remove();
    };

    // Attach event listeners
    queryInput.addEventListener('input', () => refineData(true));
    categoryFilter.addEventListener('change', () => refineData(true));
    dateSelector.addEventListener('change', () => refineData(true));
    backBtn.addEventListener('click', () => navigatePage(-1));
    forwardBtn.addEventListener('click', () => navigatePage(1));
    downloadBtn.addEventListener('click', () => {
        downloadModal.style.display = 'flex';
        refreshDownloadSummary();
        startPageInput.value = 1;
        endPageInput.value = Math.ceil(visibleTransactions.length / recordsPerPage);
        startEntryInput.value = 1;
        endEntryInput.value = Math.min(visibleTransactions.length, recordsPerPage);
        pageSpanInputs.style.display = 'block';
        entrySpanInputs.style.display = 'none';
        downloadModeRadios[0].checked = true;
    });
    abortDownload.addEventListener('click', () => {
        downloadModal.style.display = 'none';
    });
    exitModal.addEventListener('click', () => {
        downloadModal.style.display = 'none';
    });
    proceedDownload.addEventListener('click', saveAsCSV);
    downloadCategoryFilter.addEventListener('change', refreshDownloadSummary);
    downloadModeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            pageSpanInputs.style.display = radio.value === 'page' ? 'block' : 'none';
            entrySpanInputs.style.display = radio.value === 'entry' ? 'block' : 'none';
        });
    });
});
