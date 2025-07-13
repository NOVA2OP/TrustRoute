import qrcode
import os

def generate_qr(batch_id):
    url = f"https://your-frontend.com/product/{batch_id}"  # Replace this
    img = qrcode.make(url)
    
    os.makedirs("qr", exist_ok=True)
    filename = f"qr/{batch_id}_QR.png"
    img.save(filename)
    
    print(f"✅ QR Code saved as {filename}")

if __name__ == "__main__":
    batch_id = input("Enter Batch ID (e.g., WMT-B001): ")
    generate_qr(batch_id)
