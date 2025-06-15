import sqlite3
import xml.etree.ElementTree as ET
import logging
import re
import os
from datetime import datetime

# Ensure logging directory exists
log_dir = 'resources/logs'
os.makedirs(log_dir, exist_ok=True)

# Configure logging for unprocessed messages
logging.basicConfig(filename='resources/logs/processing.log', level=logging.INFO)

# Establish database connection
conn = sqlite3.connect('db/transactions.db')
cursor = conn.cursor()

# Ensure transactions table exists
cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        sender TEXT,
        receiver TEXT,
        details TEXT
    )
''')

# Load and parse XML data
tree = ET.parse('resources/modified_sms_v2.xml')
root = tree.getroot()

# Iterate through SMS entries
for sms in root.findall('sms'):
    message = sms.get('body', '')
    timestamp = sms.get('date', '')
    details = message

    # Determine transaction category
    if 'received' in message.lower():
        category = 'Incoming Money'
        sender = re.search(r'from\s+(.+?)(?:\s*\(|$)', message).group(1) if re.search(r'from\s+(.+?)(?:\s*\(|$)', message) else 'Unknown'
        receiver = 'Self'
    elif 'payment of' in message.lower() and 'to' in message.lower() and any(d in message.lower() for d in ['code', '12845', '95464']):
        category = 'Payments to Code Holders'
        receiver = re.search(r'to\s+(.+?)(?:\s+\d+|$)', message).group(1) if re.search(r'to\s+(.+?)(?:\s+\d+|$)', message) else 'Unknown'
        sender = 'Self'
    elif 'transferred to' in message.lower() or '*165*S*' in message:
        category = 'Transfers to Mobile Numbers'
        receiver = re.search(r'to\s+(.+?)(?:\s*\(|$)', message).group(1) if re.search(r'to\s+(.+?)(?:\s*\(|$)', message) else 'Unknown'
        sender = re.search(r'from\s+(.+?)(?:\s*\(|$)', message).group(1) if re.search(r'from\s+(.+?)(?:\s*\(|$)', message) else 'Unknown'
    elif 'bank deposit' in message.lower():
        category = 'Bank Deposits'
        sender = 'Bank'
        receiver = 'Self'
    elif 'airtime' in message.lower():
        category = 'Airtime Bill Payments'
        sender = 'Self'
        receiver = 'Service Provider'
    elif 'cash power' in message.lower():
        category = 'Cash Power Bill Payments'
        sender = 'Self'
        receiver = 'Utility'
    elif 'withdrawal' in message.lower() or 'agent' in message.lower():
        category = 'Withdrawals from Agents'
        sender = 'Self'
        receiver = re.search(r'agent:\s+(.+?)(?:\s*\(|$)', message).group(1) if re.search(r'agent:\s+(.+?)(?:\s*\(|$)', message) else 'Agent'
    elif 'reversal' in message.lower() or 'initiated' in message.lower():
        category = 'Transactions Initiated by Third Parties'
        sender = 'Third Party'
        receiver = re.search(r'to\s+(.+?)(?:\s*\(|$)', message).group(1) if re.search(r'to\s+(.+?)(?:\s*\(|$)', message) else 'Unknown'
    elif 'bank transfer' in message.lower() or 'transfer to' in message.lower():
        category = 'Bank Transfers'
        sender = 'Self'
        receiver = 'Bank'
    elif 'bundle' in message.lower() or 'data bundle' in message.lower():
        category = 'Internet and Voice Bundle Purchases'
        sender = 'Self'
        receiver = 'Service Provider'
    else:
        category = 'Unknown'
        logging.info(f"Skipped message: {message}")
        continue

    # Extract and format amount
    amount = float(re.search(r'(\d{1,3}(?:,\d{3})*|\d+)\s?RWF', message).group(1).replace(',', '')) if re.search(r'(\d{1,3}(?:,\d{3})*|\d+)\s?RWF', message) else 0.0

    # Convert timestamp to date string
    date = datetime.fromtimestamp(int(timestamp) / 1000).strftime('%Y-%m-%d')

    # Store in database
    cursor.execute('''
        INSERT INTO transactions (category, amount, date, sender, receiver, details)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (category, amount, date, sender, receiver, details))

# Save changes and close database
conn.commit()
conn.close()

print("SMS processing finished!")