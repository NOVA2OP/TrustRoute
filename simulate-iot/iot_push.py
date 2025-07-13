import json
import time
import random
import os

def generate_iot_data():
    temperature = round(random.uniform(22.0, 30.0), 2)
    seal_status = random.choice(["intact", "tampered"])
    timestamp = int(time.time())
    
    data = {
        "temperature": temperature,
        "seal_status": seal_status,
        "timestamp": timestamp
    }

    return data

if __name__ == "__main__":
    batch_id = input("Enter Batch ID (e.g., WMT-B001): ")
    log = generate_iot_data()
    
    # Save to a file
    os.makedirs("logs", exist_ok=True)
    filename = f"logs/{batch_id}_log.json"
    with open(filename, "w") as f:
        json.dump(log, f, indent=4)

    print(f"✅ Log saved to {filename}")
