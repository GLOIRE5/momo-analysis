# YouTube link for our video presentation
https://youtu.be/dErDJW4tWdE

# MoMo Data Analysis Dashboard

A full-stack web application that processes and analyzes MTN MoMo SMS transaction data from Rwanda. This project parses XML SMS data, stores it in a database, and provides an interactive dashboard for data visualization and analysis.

## What This Project Does

This application takes SMS messages from MTN Mobile Money and turns them into useful charts and reports. You can see how much money people spend, what they buy, and when they do transactions. 

## Project Structure

```
├── assets/                 # Frontend styling and scripts
│   ├── charts.css         # Makes the charts look nice
│   ├── charts.js          # Creates bar charts and pie charts
│   ├── core.css           # Main page styling
│   └── main.js            # Handles user clicks and data loading
├── db/                    # Database files
│   ├── db_schema.sql      # Instructions for creating database tables
│   └── transactions.db    # The actual database with all SMS data
├── resources/             # Extra files and logs
│   ├── logs/              # Error tracking files
│   │   ├── processing.log # Records what happened during data processing
│   │   └── server.log     # Records web server activity
│   └── modified_sms_v2.xml # The SMS data file we process
├── README.md              # This file
├── index.html             # The main webpage
├── parse_sms.py           # Reads XML and puts data in database
└── server.py              # Web server that connects frontend to database
```

## What Each File Does

- **parse_sms.py**: Reads the XML file with SMS messages, figures out what type each message is, cleans up the data, and saves it to the database
- **server.py**: A Flask web server that gets data from the database and sends it to the webpage
- **index.html**: The main webpage where users can see charts and filter data
- **main.js**: Makes the webpage interactive  handles button clicks, loads data, and updates charts
- **charts.js**: Creates the bar charts and pie charts using Chart.js library
- **charts.css & core.css**: Makes everything look good and organized
- **transactions.db**: SQLite database that stores all the processed SMS data
- **db_schema.sql**: Shows how the database tables are set up

## Technologies Used

- **Backend**: Python with Flask framework
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **Charts**: Chart.js library
- **Data Processing**: Python XML parsing and regular expressions

## SMS Transaction Types We Handle

1. **Airtime Bill Payments** - Buying phone credit
2. **Bank Deposits** - Putting money in the bank
3. **Cash Power Bill Payments** - Paying electricity bills
4. **Incoming Money** - Receiving money from others
5. **Internet and Voice Purchases** - Buying data bundles
6. **Payment to Code Holders** - Paying someone with a code
7. **Transactions to Third Parties** - Payments to businesses
8. **Transfers to Mobile Money** - Sending money to other phones
9. **Withdrawal from Agents** - Taking cash from MoMo agents

## Features

- **Smart Data Processing**: Automatically reads SMS messages and figures out what type they are
- **Interactive Dashboard**: Click on charts to see more details
- **Date Filtering**: Choose specific date ranges to analyze
- **Transaction Type Filtering**: Look at only one type of transaction
- **Export Data**: Save filtered results as CSV files
- **Detailed Records**: Click on any transaction to see full details
- **Real-time Charts**: Bar charts and pie charts that update when you change filters

## How to Run the Project

### Step 1: Get the Code
```bash
# Clone the repository from GitHub
git clone https://github.com/GLOIRE5/momo-analysis
cd momo-data-analysis
```

### Step 2: Set Up Your Computer
```bash
# Make sure you have Python installed (Python 3.7 or higher)
# Install required packages
pip install flask flask-cors lxml
```

### Step 3: Process the SMS Data
```bash
# Run this first to read XML file and put SMS data in the database
python parse_sms.py
```

### Step 4: Start the Flask Web Server
```bash
# Start the Flask server 
python server.py
```

### Step 6: View in Browser
Open your web browser and go to `http://localhost:8080`

## Quick Start Commands
If you just want to copy and paste:
```bash
# Terminal 1 - Set up and process data
git clone https://github.com/GLOIRE5/momo-analysis
cd momo-data-analysis
pip install flask flask-cors lxml
python parse_sms.py
python server.py

# Terminal 2 - Serve the HTML file
python -m http.server 8080
```

## How to Use the Dashboard

1. **View Overall Stats**: The main page shows total transactions and amounts
2. **Filter by Date**: Use the date picker to choose a specific time period
3. **Filter by Type**: Select a transaction type from the dropdown
4. **Export Data**: Click the "Export CSV" button to download filtered results
5. **See Details**: Click on any trancatuon to see individual transactions


## Problems We Solved

### SMS Format Issues
The SMS messages came in many different formats. We used smart pattern matching to handle this, but some messages still couldn't be processed. These get saved in the error log file.

### Server Reloading Problems
The webpage kept refreshing unexpectedly. We fixed this by properly handling the Flask server responses and making sure the frontend doesn't reload unnecessarily.

### Time Zone Problems
SMS messages had different date formats. We standardized everything to work with the same time format.


## Authors

- **GLOIRE GWIZA**
- **ESTHER MUSHIMIMANA** 
- **VERONICAH WAMBUI WANJUU**

## Important Notes

- Make sure to run `parse_sms.py` first to create the database
- The server needs to be running for the dashboard to work
- Use a proper web server  for best results

## Future Improvements

- Add more chart types
- Include transaction trends over time
- Support for multiple languages
- Mobile-responsive design improvements

  ![Screenshot 2025-06-16 222615](https://github.com/user-attachments/assets/ee2d79b4-5baa-4909-8087-b0ad5d05b9cd)

  ![Screenshot 2025-06-16 222606](https://github.com/user-attachments/assets/4fb0e713-9d41-46a3-aaee-77a060ad7f23)

  ![Screenshot 2025-06-16 222554](https://github.com/user-attachments/assets/b925dd81-199d-40e0-999f-2b949fe8187f)



  
