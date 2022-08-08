//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import {AppStorage} from "../lib/LibAppStorage.sol";
import {LibERC20} from "../lib/LibERC20.sol";
import {LibDiamond} from "../lib/LibDiamond.sol";

contract MintFacet {
    AppStorage s;

    struct MintReceiver {
        address receiver;
        uint256 value;
    }

    function mint(address _receiver, uint256 _value) external {
        LibDiamond.enforceIsContractOwner();
        require(_receiver != address(0), "_to cannot be zero address");
        s.balances[_receiver] += _value;
        s.totalSupply += _value;
        emit LibERC20.Transfer(address(0), _receiver, _value);
    }
}
