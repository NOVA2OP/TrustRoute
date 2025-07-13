# 🔗 Team Integration Guide

## For Teammate A (Smart Contract Developer)

### 📋 What You Need to Provide:
1. **Contract Address**: Replace `0x1234567890123456789012345678901234567890` in `app/page.tsx` line 37
2. **Contract ABI**: Update the ABI array in `app/page.tsx` lines 32-36 with your deployed contract
3. **Wallet Addresses**: Replace the placeholder addresses in `AUTHORIZED_ROLES` object (lines 40-45)

### 🔧 Current Contract Interface Expected:
```solidity
// Functions the frontend expects:
function addLog(string memory batchId, string memory role, string memory data) public returns (uint256)
function getLogs(string memory batchId) public view returns (tuple[])
function getAllLogs() public view returns (tuple[])

// Return format expected:
struct LogEntry {
    string batchId;
    string role; 
    string data;
    uint256 timestamp;
    address sender;
}
```

### 🎯 Test Wallets Needed:
Please provide real wallet addresses for each role:
- **Manufacturer**: 2 addresses
- **Distributor**: 2 addresses  
- **Retailer**: 2 addresses
- **Inspector**: 2 addresses

## For Teammate C (IoT Simulator + Demo)

### 📦 Frontend Features Ready for Demo:
1. **Wallet Connection**: MetaMask integration + Demo mode for testing
2. **Form Submission**: Role-based log submission with validation
3. **QR Code Generation**: Auto-generates QR codes for batches with URLs
4. **Timeline View**: Real-time chronological supply chain history
5. **Batch Search**: Filter by specific batch ID with URL updates
6. **URL Sharing**: QR codes link to `/?batch=BATCH_ID` for direct access
7. **Demo Mode**: Full functionality without blockchain for testing
8. **IoT Data Generator**: Automatic sample data generation for realistic demos
9. **Real-time Updates**: New logs appear immediately in timeline
10. **Role Authorization**: Visual indicators for authorized/unauthorized roles

### 🎬 Enhanced Demo Flow:
1. **Setup**: 
   - Click "Connect Wallet" (works in demo mode without MetaMask)
   - Notice "Demo Mode" badge and user authorization status
2. **Scene 1**: Manufacturer creates initial log for new batch
   - Use "Generate IoT Sample Data" button for realistic data
   - Submit and watch log appear in timeline immediately
3. **Scene 2**: Generate and download QR code
   - QR code updates automatically when batch ID is entered
   - Show mobile scanning capability
4. **Scene 3**: Switch to different role (simulate different user)
   - Show role authorization in dropdown
   - Add distributor log entry to same batch
5. **Scene 4**: Add retailer log to complete the chain
   - Demonstrate full supply chain transparency
6. **Scene 5**: Show complete timeline with all entries
   - Demonstrate filtering by batch ID
   - Show transaction hashes and wallet addresses
7. **Scene 6**: Mobile QR scanning demonstration
   - Scan QR code to open batch timeline directly

### 🔄 IoT Integration Points:
- **Demo Mode**: Set `DEMO_MODE = true` in `app/page.tsx` (currently enabled)
- **Form Interface**: Use the form at `/` to submit logs
- **Batch ID Format**: `BATCH001`, `BATCH002`, etc. (auto-generates QR codes)
- **IoT Data**: Click "Generate IoT Sample Data" button for realistic sensor data
- **Sample Data Format**: `Temperature: 2°C, Humidity: 45%, Seal: Good, Location: Transit Truck #123`
- **Role Selection**: Dropdown with authorization validation
- **Real-time Updates**: New logs appear immediately without page refresh

### 📱 QR Code Features:
- **Auto-generation**: QR codes generate automatically when batch ID is entered
- **Direct URLs**: `http://localhost:3000/?batch=BATCH001` 
- **Mobile Scanning**: QR codes open batch timeline directly on mobile
- **Download Feature**: Save QR codes as PNG files for physical labeling
- **URL Parameters**: Batch filtering via URL for easy sharing

## 🚀 Current Status

### ✅ Completed (Frontend):
- [x] MetaMask wallet connection with demo mode fallback
- [x] Smart contract integration (ethers.js) with demo simulation
- [x] Role-based form validation with visual authorization indicators
- [x] QR code generation with batch linking and download feature
- [x] Real-time timeline visualization with immediate updates
- [x] Batch search and filtering with URL parameter support
- [x] Responsive UI with dark/light mode toggle
- [x] URL-based batch sharing for mobile scanning
- [x] Transaction status feedback with toast notifications
- [x] IoT sample data generator for realistic demos
- [x] Demo mode for testing without blockchain connectivity
- [x] Dynamic log addition with persistent state management
- [x] Role authorization system with wallet address validation

### 🔄 Pending Integration:
- [ ] Real contract address from Teammate A (currently using placeholder)
- [ ] Real contract ABI from Teammate A (current ABI is simplified)  
- [ ] Actual wallet addresses for roles (currently using demo addresses)
- [ ] Production deployment configuration
- [ ] Video recording coordination with Teammate C

### 🎯 Ready for Production:
- [ ] Switch `DEMO_MODE = false` in `app/page.tsx`
- [ ] Update `CONTRACT_ADDRESS` with deployed contract
- [ ] Replace demo wallet addresses in `AUTHORIZED_ROLES`
- [ ] Test with real MetaMask wallets on testnet

## 🔧 Quick Start for Testing

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   # or  
   pnpm dev
   ```

3. **Test Demo Mode** (No MetaMask required):
   - Open `http://localhost:3000`
   - Click "Connect Wallet" (connects demo wallet automatically)
   - Notice "Demo Mode" badge and "Authorized as: Manufacturer"
   - Fill form and click "Generate IoT Sample Data"
   - Submit log and watch it appear in timeline immediately
   - Generate QR code and test URL functionality

4. **Test with Real MetaMask** (When blockchain is ready):
   - Set `DEMO_MODE = false` in `app/page.tsx`
   - Install MetaMask browser extension
   - Connect to your test network
   - Update contract address and wallet addresses

## 🚨 Important Notes for Demo

- **Current State**: Fully functional in demo mode
- **Demo Data**: Includes sample logs for BATCH001 and BATCH002
- **New Logs**: Added logs persist and appear in real-time
- **QR Codes**: Generate valid URLs that work on mobile devices
- **Role System**: Shows authorization status for each wallet
- **No Dependencies**: Works without blockchain for demonstrations

## 📞 Contact
- **Frontend Lead (You)**: ✅ Ready for integration testing and demo recording
- **Status**: All frontend features complete and tested in demo mode
- **Next Steps**: Coordinate with teammates for final integration
- **Demo Ready**: Can record video demonstration immediately with full functionality
