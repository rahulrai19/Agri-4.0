import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

from pathlib import Path

# Try loading from current directory
load_dotenv()

# Helper to manually read env file if dotenv fails
def manual_read_env(path):
    try:
        content = open(path, "r").read()
        with open("db_debug.log", "a") as log:
            log.write(f"\n--- READING {path} ---\n")
            log.write(content)
            log.write("\n--- END OF FILE ---\n")
        
        for line in content.splitlines():
            line = line.strip()
            if line.startswith("MONGO_URI"):
                # Handle MONGO_URI=value or MONGO_URI = value
                parts = line.split("=", 1)
                if len(parts) == 2:
                    return parts[1].strip().strip('"').strip("'")
    except Exception as e:
        with open("db_debug.log", "a") as log:
             log.write(f"Error reading {path}: {e}\n")
    return None

MONGO_URI = os.getenv("MONGO_URI")

# Fallback: Manual scan
if not MONGO_URI:
    # Try backend/.env
    backend_env = Path(__file__).parent / ".env"
    MONGO_URI = manual_read_env(backend_env)
    
    if not MONGO_URI:
        # Try root .env
        root_env = Path(__file__).parent.parent / ".env"
        MONGO_URI = manual_read_env(root_env)

# Hard Fallback for Critical Debugging (optional, removed for security but good for dev)
# if not MONGO_URI:
#     print("CRITICAL: Still no MONGO_URI found.")

def get_db():
    if not MONGO_URI:
        print("WARNING: MONGO_URI not found.")
        return None

    try:
        # tlsCAFile is needed for MongoDB Atlas to work with some SSL environments
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        
        # Try to get the default database from the URI, or fallback to 'agri4'
        try:
            db = client.get_default_database()
        except:
            db = client["agri4"]
        
        # Test connection
        client.admin.command('ping')
        print("Connected successfully to MongoDB!")
        return db
    except Exception as e:
        print(f"Initial connection failed: {e}")
        try:
            print("Retrying without SSL verification...")
            client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
            db = client.get_default_database()
            client.admin.command('ping')
            print("Connected successfully to MongoDB! (Insecure fallback)")
            return db
        except Exception as e2:
            print(f"All Connection Attempts Failed: {e2}")
            return None

db = get_db()
