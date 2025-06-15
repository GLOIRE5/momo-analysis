body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 30px;
    background: #f5f5f5; /* Light ash background */
    color: #333; /* Darker text for better contrast */
}

.hero {
    text-align: center;
    padding: 20px;
    background: #ffffff; /* Pure white */
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    color: #2c3e50; /* Dark blue-gray for text */
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

@media (min-width: 1024px) {
    .container {
        grid-template-columns: 1fr 1fr;
    }
}

section {
    padding: 20px;
    background: #ffffff; /* White background */
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Softer shadow */
}

#controls .control-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

@media (min-width: 768px) {
    #controls .control-panel {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
}

#controls input, #controls select {
    padding: 10px;
    border: 1px solid #ddd; /* Light gray border */
    border-radius: 8px;
    background: #fff;
    color: #333;
    font-size: 16px;
    transition: all 0.3s ease;
}

#controls input:focus, #controls select:focus {
    outline: none;
    border-color: #3498db; /* Light blue focus */
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

#controls button {
    padding: 10px;
    border: none;
    border-radius: 8px;
    background: #3498db; /* Light blue */
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

#controls button:hover {
    background: #2980b9; /* Slightly darker blue */
}

#charts {
    min-height: 500px;
}

.graph-container {
    width: 100%;
    height: 450px;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
}

#recordsDisplay .record-list {
    list-style: none;
    padding: 0;
    max-height: 550px;
    overflow-y: auto;
}

.record-item {
    margin: 8px 0;
    padding: 15px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
}

.record-item:hover {
    background: #f8f9fa; /* Very light gray on hover */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.expand-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    background: none;
    border: none;
    color: #3498db; /* Light blue */
    font-size: 18px;
    cursor: pointer;
}

.hidden-details {
    display: none;
    margin-top: 10px;
    color: #555; /* Dark gray */
    border-top: 1px solid #eee;
    padding-top: 10px;
}

#navigator {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
}

#navigator button {
    padding: 10px 20px;
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

#navigator button:disabled {
    background: #95a5a6; /* Gray */
    cursor: not-allowed;
}

#navInfo {
    font-size: 16px;
    color: #7f8c8d; /* Gray */
}

.modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    color: #333;
    flex-direction: column;
    gap: 15px;
    max-width: 500px;
    width: 90%;
    border: 1px solid #eee;
}

#modalTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#exitModal {
    background: none;
    border: none;
    color: #e74c3c; /* Red */
    font-size: 20px;
    cursor: pointer;
}

#downloadInfo {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #555;
}

.download-options {
    display: flex;
    gap: 25px;
    margin: 15px 0;
}

#pageSpanInputs, #entrySpanInputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#pageSpanInputs input, #entrySpanInputs input {
    padding: 8px;
    background: #fff;
    border: 1px solid #ddd;
    color: #333;
    border-radius: 8px;
}

.download-buttons {
    display: flex;
    gap: 15px;
}

#proceedDownload {
    padding: 10px 20px;
    background: #2ecc71; /* Green */
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

#abortDownload {
    padding: 10px 20px;
    background: #e74c3c; /* Red */
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.modal-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 85vh;
    overflow-y: auto;
    color: #333;
    max-width: 600px;
    width: 90%;
    border: 1px solid #eee;
}

.modal-panel button {
    padding: 10px 20px;
    background: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .modal-panel {
        width: 95%;
        padding: 20px;
    }
}

/* Additional styling for better light theme */
h1, h2, h3 {
    color: #2c3e50; /* Dark blue-gray */
}

/* Scrollbar styling for light theme */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #bdc3c7;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #95a5a6;
}
