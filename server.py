from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import logging

# Configure logging for server diagnostics
logging.basicConfig(
    filename='resources/logs/server.log', 
    level=logging.DEBUG, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Initialize Flask app
app = Flask(__name__, static_folder='../assets')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Disable Flask's default logger to prevent duplicate output
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.ERROR)

# API endpoint for transactions
@app.route('/api/transactions', methods=['GET'])
def fetch_transactions():
    try:
        # Construct absolute database path from the script's directory
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db/transactions.db')
        logging.info(f"Attempting to connect to database at: {db_path}")

        # Verify database file exists
        if not os.path.exists(db_path):
            logging.error(f"Database file not found at: {db_path}")
            return jsonify({"error": "Database file not found. Please ensure transactions.db exists in the db folder."}), 404

        # Connect to database
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Check if transactions table exists and has data
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'")
        if not cursor.fetchone():
            logging.error("Transactions table does not exist in the database")
            conn.close()
            return jsonify({"error": "Transactions table not found. Please run parse_sms.py to create it."}), 500

        cursor.execute("SELECT COUNT(*) FROM transactions")
        count = cursor.fetchone()[0]
        logging.info(f"Found {count} records in transactions table")

        if count == 0:
            logging.warning("No records found in transactions table")
            conn.close()
            return jsonify([]), 200

        # Query transactions
        cursor.execute("SELECT * FROM transactions")
        data = cursor.fetchall()
        logging.info(f"Retrieved {len(data)} records from transactions table")

        # Close connection
        conn.close()

        return jsonify([dict(row) for row in data])

    except sqlite3.OperationalError as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

# Serve main page
@app.route('/')
def serve_index():
    try:
        logging.info("Serving index.html")
        return send_from_directory('..', 'index.html')
    except Exception as e:
        logging.error(f"Error serving index.html: {str(e)}")
        return jsonify({"error": "Failed to serve page"}), 500

if __name__ == '__main__':
    # Ensure log directory exists
    os.makedirs('resources/logs', exist_ok=True)
    
    # Print startup message before initializing Flask
    print("\nStarting MoMo Analytics Server...")
    print("--------------------------------")
    
    try:
        app.run(
            debug=False, 
            port=5000, 
            use_reloader=False,  # Disable reloader to prevent double output
            host='0.0.0.0'      # Make server publicly available
        )
    except Exception as e:
        logging.error(f"Failed to start server: {str(e)}")
        print(f"\nServer failed to start: {str(e)}")
    finally:
        print("\nServer stopped")