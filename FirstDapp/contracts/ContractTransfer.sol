// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
contract ContractTransfer {

    using SafeERC20 for IERC20;

    constructor(){}

    function transferERC20tokens(address _token, address _to, uint _amount) external payable {
        IERC20(_token).transferFrom(msg.sender, _to, _amount);
    }


    receive() external payable {
        
    }
}