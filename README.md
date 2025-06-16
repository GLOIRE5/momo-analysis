# MoMo Insights Design Report

## Approach
This application processes MTN MoMo SMS data from an XML file in the `data` folder, categorizing transactions into 'Incoming Money', 'Bank Deposits', 'Withdrawals from Agents', and 'Other'. Data is cleaned, logged for errors, and stored in an SQLite database. A Flask backend serves APIs, while a frontend dashboard provides interactive analysis.

## Design Decisions
- **Database Schema:** `transactions` table with `id`, `type`, `amount`, `date`, `sender`, `receiver`, and `description` fields.
- Data Cleaning: Normalizes amounts and dates, logs unprocessed data to `parser_errors.log`.
- Color Scheme: Earthy tones (#6B705C, #8B4513, #F5F5EF) for a unique aesthetic.
- Visualizations: Pie chart for monthly totals offers clear insights.

## Functionality
- **Search and Filter:** Search by text, filter by type or date.
- **Details View:** Click to view sender, receiver, and description.
- **Export:** Export filtered data to CSV.
- **Visualization:** Pie chart for monthly summaries.
## How to run the application:
first install : pip install flask flask-cors 
Process the XML data run this script to parse and clean the data: python parse_sms.py
Start the Flask server:python server.py
 
## summary on application:
The application processes MoMo SMS from an XML file and stores them in an SQLite database.
The server serves APIs.
The frontend uses static HTML/JS to fetch data from the backend.
There is no single "Start" button — you have to run scripts manually.
There’s no mention of requirements.txt, so you must manually install flask and flask-cors.