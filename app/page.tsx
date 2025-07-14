"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any
  }
}
import { ethers } from "ethers"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Wallet, Package, Clock, User, FileText, QrCode, CheckCircle, AlertCircle, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import QRCode from "qrcode"
import { useSearchParams, useRouter } from "next/navigation"
import { DEMO_WALLET_ADDRESSES, SAMPLE_LOGS, generateIoTLog } from "@/lib/demo-data"
import contractABI from "../contracts/TrustRoute_ABI.json";
import contractConfig from "../contracts/config.json";

const CONTRACT_ABI = contractABI;
const CONTRACT_ADDRESS = contractConfig.contractAddress;
const KNOWN_BATCH_IDS = ["BATCH001", "BATCH002", "BATCH003"]; 

// Smart Contract ABI (simplified for demo)
//const CONTRACT_ABI = [
//  "function addLog(string memory batchId, string memory role, string memory data) public returns (uint256)",
//  "function getLogs(string memory batchId) public view returns (tuple(string batchId, string role, string data, uint256 timestamp, address sender)[])",
//  "function getAllLogs() public view returns (tuple(string batchId, string role, string data, uint256 timestamp, address sender)[])",
//]

// Replace with your deployed contract address from Teammate A
//const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" // TODO: Update when deployed

// Demo mode - set to false when blockchain is ready
const DEMO_MODE = false
async function fetchUserRole(address: string, provider: ethers.BrowserProvider) {
  if (!address || !provider) return null;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  return await contract.userRoles(address);
}
/*
// Role verification - Update with hardcoded addresses from Teammate A
const AUTHORIZED_ROLES = {
  "Manufacturer": DEMO_MODE ? [DEMO_WALLET_ADDRESSES.manufacturer1, DEMO_WALLET_ADDRESSES.manufacturer2] : ["0xManufacturerAddress1", "0xManufacturerAddress2"],
  "Distributor": DEMO_MODE ? [DEMO_WALLET_ADDRESSES.distributor1, DEMO_WALLET_ADDRESSES.distributor2] : ["0xDistributorAddress1", "0xDistributorAddress2"],
  "Retailer": DEMO_MODE ? [DEMO_WALLET_ADDRESSES.retailer1, DEMO_WALLET_ADDRESSES.retailer2] : ["0xRetailerAddress1", "0xRetailerAddress2"],
  "Inspector": DEMO_MODE ? [DEMO_WALLET_ADDRESSES.inspector1, DEMO_WALLET_ADDRESSES.inspector2] : ["0xInspectorAddress1", "0xInspectorAddress2"],
}
*/
// Helper function to check if wallet address is authorized for a role
/*
const isAuthorizedForRole = (address: string, role: string): boolean => {
  const authorizedAddresses = AUTHORIZED_ROLES[role as keyof typeof AUTHORIZED_ROLES]
  return authorizedAddresses?.includes(address) || false
}

// Get user's role based on their wallet address
const getUserRole = (address: string): string | null => {
  for (const [role, addresses] of Object.entries(AUTHORIZED_ROLES)) {
    if (addresses.includes(address)) {
      return role
    }
  }
  return null
}
*/


interface ProductLog {
  id: string
  batchId: string
  role: string
  data: string
  timestamp: Date
  txHash: string
  sender: string
}

interface WalletState {
  isConnected: boolean
  address: string
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
}

// Update AppSidebar to accept props:
function AppSidebar({ onViewChange }: { onViewChange: (view: string) => void }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <span className="font-semibold">Supply Chain</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => onViewChange("dashboard")}>
            <Package className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onViewChange("logs")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Product Logs</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onViewChange("qr")}>
            <QrCode className="mr-2 h-4 w-4" />
            <span>QR Codes</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => onViewChange("timeline")}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Timeline</span>
          </Button>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}


function ConnectWalletButton({
  wallet,
  onWalletChange,
}: {
  wallet: WalletState
  onWalletChange: (wallet: WalletState) => void
}) {
  const connectWallet = async () => {
    try {
      if (DEMO_MODE) {
        // Demo mode - simulate wallet connection
        const demoAddress = DEMO_WALLET_ADDRESSES.manufacturer1
        onWalletChange({
          isConnected: true,
          address: demoAddress,
          provider: null, // Not needed in demo mode
          signer: null, // Not needed in demo mode
        })

        toast({
          title: "Demo Wallet Connected",
          description: `Connected to demo wallet ${demoAddress.slice(0, 6)}...${demoAddress.slice(-4)}`,
        })
        return
      }

      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet",
          variant: "destructive",
        })
        return
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      onWalletChange({
        isConnected: true,
        address,
        provider,
        signer,
      })

      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    onWalletChange({
      isConnected: false,
      address: "",
      provider: null,
      signer: null,
    })
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <div className="flex items-center gap-2">
      {wallet.isConnected ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </Badge>
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet} className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

function ProductLogForm({
  wallet,
  userRole,
  onLogAdded,
  onBatchIdChange,
  onNewLog,
}: {
  wallet: WalletState
  userRole: string | null
  onLogAdded: () => void
  onBatchIdChange: (batchId: string) => void
  onNewLog?: (log: ProductLog) => void
}) {
  const [batchId, setBatchId] = useState("")
  const [data, setData] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get user's authorized role

  const handleBatchIdChange = (value: string) => {
    setBatchId(value)
    onBatchIdChange(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!batchId || !data) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Check if user is authorized for the selected role
    setIsSubmitting(true)

    try {
      if (DEMO_MODE) {
        // Demo mode - simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate network delay
        
        // Create new log entry
        const newLog: ProductLog = {
        id: `demo-${Date.now()}`,
        batchId: batchId,
        role: userRole || "",
        data: data,
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        sender: wallet.address
      }

        // Add to logs state immediately
        if (onNewLog) {
          onNewLog(newLog)
        }
        
        toast({
          title: "Demo Log Added Successfully", 
          description: "Your log has been recorded in demo mode",
        })

        // Clear form
        setBatchId("")
        setData("")
        // Don't call onLogAdded in demo mode as it resets the logs
        return
      }

      if (!wallet.signer) {
        toast({
          title: "Wallet Error",
          description: "No signer available",
          variant: "destructive",
        })
        return
      }

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet.signer)

      // Send transaction
      if (!userRole) {
        toast({
          title: "Unauthorized",
          description: "Your wallet is not authorized for any role",
          variant: "destructive",
        })
        return
      }
      const tx = await contract.addLog(batchId, data)

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash.slice(0, 10)}...`,
      })

      // Wait for confirmation
      await tx.wait()

      toast({
        title: "Log Added Successfully",
        description: "Your log has been recorded on the blockchain",
      })

      // Clear form
      setBatchId("")
      setData("")
      onLogAdded()
    } catch (error: any) {
      console.error("Transaction failed:", error)
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to add log to blockchain",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Add Product Log
        </CardTitle>
        <CardDescription>Record a new entry in the supply chain blockchain</CardDescription>
        {wallet.isConnected && userRole && (
          <Badge variant="secondary" className="w-fit">
            Authorized as: {userRole}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID</Label>
            <Input
              id="batchId"
              placeholder="Enter batch identifier (e.g., BATCH001)"
              value={batchId}
              onChange={(e) => handleBatchIdChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={userRole || ""} disabled />
            {!userRole && (
              <p className="text-sm text-destructive">
                Your wallet is not authorized for any role.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Textarea
              id="data"
              placeholder={DEMO_MODE ? generateIoTLog(userRole || "") : "Enter relevant information about this step in the supply chain"}
              value={data}
              onChange={(e) => setData(e.target.value)}
              rows={3}
            />
            {DEMO_MODE && userRole && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setData(generateIoTLog(userRole))}
              >
                Generate IoT Sample Data
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting || (!wallet.isConnected && !DEMO_MODE)} className="w-full">
            {isSubmitting ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                {DEMO_MODE ? "Adding Demo Log..." : "Submitting to Blockchain..."}
              </>
            ) : (
              DEMO_MODE ? "Submit Demo Log" : "Submit Log"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function QRCodeGenerator({ batchId }: { batchId: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    if (batchId) {
      // Create URL that includes the batch ID for scanning
      const appUrl = `${window.location.origin}?batch=${encodeURIComponent(batchId)}`
      QRCode.toDataURL(appUrl, { width: 200, margin: 2 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err))
    } else {
      setQrCodeUrl("")
    }
  }, [batchId])

  if (!batchId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator
          </CardTitle>
          <CardDescription>Enter a batch ID above to generate a QR code</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>QR code will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code for Batch: {batchId}
        </CardTitle>
        <CardDescription>Scan this QR code to view batch timeline</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrCodeUrl && (
          <img src={qrCodeUrl || "/placeholder.svg"} alt={`QR Code for ${batchId}`} className="border rounded-lg" />
        )}
        <Button
          variant="outline"
          onClick={() => {
            if (qrCodeUrl) {
              const link = document.createElement("a")
              link.download = `qr-${batchId}.png`
              link.href = qrCodeUrl
              link.click()
            }
          }}
        >
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  )
}

function BatchSearch({ onBatchSelect }: { onBatchSelect: (batchId: string) => void }) {
  const [searchBatch, setSearchBatch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchBatch.trim()) {
      onBatchSelect(searchBatch.trim())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Batch
        </CardTitle>
        <CardDescription>Enter a batch ID to view its timeline</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input placeholder="Enter batch ID" value={searchBatch} onChange={(e) => setSearchBatch(e.target.value)} />
          <Button type="submit">Search</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ProductTimeline({
  logs,
  wallet,
  selectedBatch,
  onRefresh,
}: {
  logs: ProductLog[]
  wallet: WalletState
  selectedBatch: string
  onRefresh: () => void
}) {
  const filteredLogs = selectedBatch ? logs.filter((log) => log.batchId === selectedBatch) : logs

  const sortedLogs = [...filteredLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Product Timeline
            {selectedBatch && <Badge variant="outline">Batch: {selectedBatch}</Badge>}
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          {selectedBatch ? `Showing logs for batch ${selectedBatch}` : "Complete history of all product logs"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedLogs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No logs found</p>
            <p className="text-sm">
              {selectedBatch ? `No logs found for batch ${selectedBatch}` : "Add your first product log above"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLogs.map((log, index) => (
              <div key={log.id} className="relative">
                {index < sortedLogs.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {log.batchId}
                          </Badge>
                          <h4 className="font-semibold">{log.role}</h4>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{log.timestamp.toLocaleDateString()}</p>
                          <p>{log.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.data}</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>TX:</span>
                          <code className="bg-muted px-1 rounded">{log.txHash}</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>From:</span>
                          <code className="bg-muted px-1 rounded">{log.sender}</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [userRole, setUserRole] = useState<string | null>(null);
  const [section, setSection] = useState("dashboard")
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: "",
    provider: null,
    signer: null,
  })
  const [logs, setLogs] = useState<ProductLog[]>([])
  const [currentBatchId, setCurrentBatchId] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with demo data when in demo mode
  useEffect(() => {
    if (DEMO_MODE) {
      setLogs([...SAMPLE_LOGS])
    }
  }, [])

  useEffect(() => {
    if (wallet.isConnected && wallet.provider) {
      fetchUserRole(wallet.address, wallet.provider).then(setUserRole)
    } else {
      setUserRole(null)
    }
  }, [wallet.isConnected, wallet.address, wallet.provider])

  const searchParams = useSearchParams()
  const router = useRouter()

  // Check for batch ID in URL on load
  useEffect(() => {
    const batchFromUrl = searchParams.get("batch")
    if (batchFromUrl) {
      setSelectedBatch(batchFromUrl)
      setCurrentBatchId(batchFromUrl)
    }
  }, [searchParams])

  // Fetch logs from blockchain
  const fetchLogs = async () => {
  if (!wallet.isConnected || !wallet.provider) return;

  setIsLoading(true);

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet.provider);
    let allLogs: ProductLog[] = [];

    for (const batchId of KNOWN_BATCH_IDS) {
      const contractLogs = await contract.getLogs(batchId);

      const formattedLogs: ProductLog[] = contractLogs.map((log: any, index: number) => ({
        id: `${batchId}-${log.timestamp}-${index}`,
        batchId,
        role: log.role,
        data: log.data,
        timestamp: new Date(Number(log.timestamp) * 1000),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // You can replace this with real hash later
        sender: log.addedBy,
      }));

      allLogs = allLogs.concat(formattedLogs);
    }

    setLogs(allLogs);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    toast({
      title: "Fetch Error",
      description: "Could not retrieve logs from blockchain",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  // Fetch logs when wallet connects or selected batch changes
  useEffect(() => {
    if (wallet.isConnected) {
      fetchLogs();
    }
  }, [wallet.isConnected]);


  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId)
    setCurrentBatchId(batchId)
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set("batch", batchId)
    router.push(url.pathname + url.search)
  }

  const clearBatchFilter = () => {
    setSelectedBatch("")
    // Clear URL parameter
    const url = new URL(window.location.href)
    url.searchParams.delete("batch")
    router.push(url.pathname + url.search)
  }

  // Handle adding new logs in demo mode
  const handleNewLog = (newLog: ProductLog) => {
    setLogs(currentLogs => [...currentLogs, newLog])
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar onViewChange={setActiveView} />
          <SidebarInset>
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold">Supply Chain Dashboard</h1>
                  {DEMO_MODE && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Demo Mode
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <ConnectWalletButton wallet={wallet} onWalletChange={setWallet} />
                </div>
              </div>
            </header>

            <main className="flex-1 p-6 space-y-6">
              {activeView === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ProductLogForm 
                      wallet={wallet} 
                      userRole={userRole} // <-- ADD THIS PROP
                      onLogAdded={fetchLogs} 
                      onBatchIdChange={setCurrentBatchId}
                      onNewLog={handleNewLog}
                    />
                    <QRCodeGenerator batchId={currentBatchId} />
                    <BatchSearch onBatchSelect={handleBatchSelect} />
                  </div>
                  <div>
                    <ProductTimeline
                      logs={
                        wallet.isConnected
                          ? logs.filter(log => log.sender.toLowerCase() === wallet.address.toLowerCase())
                          : []
                      }
                      wallet={wallet}
                      selectedBatch={selectedBatch}
                      onRefresh={fetchLogs}
                    />
                    {selectedBatch && (
                      <div className="mt-4">
                        <Button variant="outline" onClick={clearBatchFilter}>
                          Show All Batches
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeView === "logs" && (
                <ProductLogForm 
                  wallet={wallet} 
                  userRole={userRole}
                  onLogAdded={fetchLogs} 
                  onBatchIdChange={setCurrentBatchId}
                  onNewLog={handleNewLog}
                />
              )}

              {activeView === "qr" && <QRCodeGenerator batchId={currentBatchId} />}

              {activeView === "timeline" && (
                <ProductTimeline logs={logs} wallet={wallet} selectedBatch={selectedBatch} onRefresh={fetchLogs} />
              )}
            </main>
          </SidebarInset>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}
