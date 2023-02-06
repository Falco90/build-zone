// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Zone is Initializable {
    string[] public cids;
    mapping(address => bool) public members;
    address[] memberAddresses;
    address public owner;

    function initialize(address _owner) external initializer {
        owner = _owner;
        members[_owner] = true;
        memberAddresses.push(_owner);
    }

    function getFiles() public view returns (string[] memory) {
        return cids;
    }

    function addCid(string memory _cid) public {
        require(
            members[msg.sender] == true,
            "only members can call this function"
        );
        cids.push(_cid);
    }

    function removeCid(uint256 _index) public {
        require(_index < cids.length, "index out of bound");

        for (uint256 i = _index; i < cids.length - 1; i++) {
            cids[i] = cids[i + 1];
        }
        cids.pop();
    }

    function getMember(address _addr) public view returns (bool) {
        return members[_addr];
    }

    function getMembers() public view returns (address[] memory) {
        return memberAddresses;
    }

    function addMember(address _addr) public {
        members[_addr] = true;
        memberAddresses.push(_addr);
    }

    function removeMember(address _addr, uint256 _index) public {
        require(_index < memberAddresses.length, "index out of bound");
        require(_addr != owner, "cannot remove owner");
        delete members[_addr];

        for (uint256 i = _index; i < memberAddresses.length - 1; i++) {
            memberAddresses[i] = memberAddresses[i + 1];
        }
        memberAddresses.pop();
    }
}
