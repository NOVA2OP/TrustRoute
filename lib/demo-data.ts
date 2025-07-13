// Demo data for testing frontend before blockchain integration
export const DEMO_WALLET_ADDRESSES = {
  manufacturer1: "0x742E4C4e9C7d8a4Db5Bf47F6A2a8e3B19b8C6D2F",
  manufacturer2: "0x8F3A2e1B4C6D8E9F1A2B3C4D5E6F7A8B9C0D1E2F", 
  distributor1: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B",
  distributor2: "0x9F8E7D6C5B4A3F2E1D0C9B8A7F6E5D4C3B2A1F0E",
  retailer1: "0x5E4D3C2B1A0F9E8D7C6B5A4F3E2D1C0B9A8F7E6D",
  retailer2: "0x2D1C0B9A8F7E6D5C4B3A2F1E0D9C8B7A6F5E4D3C",
  inspector1: "0x6F5E4D3C2B1A0F9E8D7C6B5A4F3E2D1C0B9A8F7E",
  inspector2: "0x3C2B1A0F9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4B"
}

export const SAMPLE_LOGS = [
  {
    id: "demo-1",
    batchId: "BATCH001", 
    role: "Manufacturer",
    data: "Product manufactured. Temperature: 2°C, Quality check passed",
    timestamp: new Date("2024-01-15T08:00:00Z"),
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    sender: DEMO_WALLET_ADDRESSES.manufacturer1
  },
  {
    id: "demo-2", 
    batchId: "BATCH001",
    role: "Distributor", 
    data: "Received from manufacturer. Cold chain maintained, no damage detected",
    timestamp: new Date("2024-01-16T14:30:00Z"),
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    sender: DEMO_WALLET_ADDRESSES.distributor1
  },
  {
    id: "demo-3",
    batchId: "BATCH001", 
    role: "Retailer",
    data: "Product received in good condition. Placed in refrigerated display",
    timestamp: new Date("2024-01-17T09:15:00Z"), 
    txHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    sender: DEMO_WALLET_ADDRESSES.retailer1
  },
  {
    id: "demo-4",
    batchId: "BATCH002",
    role: "Manufacturer", 
    data: "Organic batch produced. Certified organic, pesticide-free",
    timestamp: new Date("2024-01-18T10:00:00Z"),
    txHash: "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789", 
    sender: DEMO_WALLET_ADDRESSES.manufacturer2
  }
]

export const IOT_SAMPLE_DATA = {
  temperature: () => Math.round((Math.random() * 8 - 2) * 10) / 10, // -2 to 6°C
  humidity: () => Math.round((Math.random() * 30 + 40)), // 40-70%
  sealIntegrity: () => Math.random() > 0.1 ? "Good" : "Compromised",
  location: () => {
    const locations = ["Warehouse A", "Transit Truck #123", "Distribution Center B", "Store Location #456"]
    return locations[Math.floor(Math.random() * locations.length)]
  },
  batteryLevel: () => Math.round(Math.random() * 100) + "%"
}

// Generate IoT-style log data
export const generateIoTLog = (role: string): string => {
  const temp = IOT_SAMPLE_DATA.temperature()
  const humidity = IOT_SAMPLE_DATA.humidity()
  const seal = IOT_SAMPLE_DATA.sealIntegrity()
  const location = IOT_SAMPLE_DATA.location()
  const battery = IOT_SAMPLE_DATA.batteryLevel()
  
  switch(role) {
    case "Manufacturer":
      return `Production complete. Temp: ${temp}°C, Quality: Passed, Batch sealed`
    case "Distributor": 
      return `In transit. Temp: ${temp}°C, Humidity: ${humidity}%, Seal: ${seal}, Location: ${location}`
    case "Retailer":
      return `Received at store. Temp: ${temp}°C, Condition: Good, Placed in cold storage`
    case "Inspector":
      return `Quality inspection. Temp: ${temp}°C, Humidity: ${humidity}%, Seal: ${seal}, Status: Approved`
    default:
      return `Sensor data: Temp: ${temp}°C, Humidity: ${humidity}%, Battery: ${battery}`
  }
}
