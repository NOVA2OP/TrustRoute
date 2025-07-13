// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustRoute {
    struct Log {
        string role;
        string data;
        uint256 timestamp;
        address addedBy;
    }

    mapping(string => Log[]) public batchLogs;
    mapping(address => string) public userRoles;

    address public admin;

    constructor() {
        admin = msg.sender; // Deploying wallet is admin
    }

    // Admin assigns roles
    function assignRole(address user, string memory role) public {
        require(msg.sender == admin, "Only admin can assign roles");
        userRoles[user] = role;
    }

    // Add log only if sender has a valid role
    function addLog(string memory batchId, string memory data) public {
        string memory role = userRoles[msg.sender];
        require(bytes(role).length > 0, "You are not authorized");

        Log memory newLog = Log({
            role: role,
            data: data,
            timestamp: block.timestamp,
            addedBy: msg.sender
        });

        batchLogs[batchId].push(newLog);
    }

    function getLogs(string memory batchId) public view returns (Log[] memory) {
        return batchLogs[batchId];
    }
}
