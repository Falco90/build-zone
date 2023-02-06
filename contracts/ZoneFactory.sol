// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

interface Zone {
    function initialize(address _owner) external;
}

contract ZoneFactory {
    address public implementation;
    mapping(address => address[]) public zones;

    event CloneCreated(address target);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function getZones() public view returns (address[] memory) {
        return zones[msg.sender];
    }

    function deployAndInitialize() public returns (address){
        address _clone = Clones.clone(implementation);
        Zone(_clone).initialize(msg.sender);
        zones[msg.sender].push(_clone);
        emit CloneCreated(_clone);
        return _clone;
    }
}