// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MLM is Ownable, ReentrancyGuard {

    using SafeERC20 for IERC20;
    address public commissionWallet = 0x712ab74e796f2C79Ee53F3405F4E8d6c30e175eF;
    address public receiptWallet = 0x712ab74e796f2C79Ee53F3405F4E8d6c30e175eF;

    IERC20 coin;

    modifier isReceiptWallet() {
        require((msg.sender == receiptWallet), "This is not a receipt wallet.");
        _;
    }
    
    constructor(address _coin) Ownable() ReentrancyGuard() {
        coin = IERC20(_coin);
    }
    struct User {
        bool registered; // Flag to check if the user is registered
        address referrer;
        // uint256 balance;
        uint256 referralCommission;
        uint256 withdrawnReward;
        mapping(uint8=>uint256) referralsCount;
    }
    mapping(address=>User) public users;
    uint256 public totalRest;
    function buyTicket(address referrer) external {
        // require(!users[msg.sender].registered, "Already bought");
        IERC20(coin).safeTransferFrom(msg.sender, address(this), 25*(10**6));
        // uint40 aa = uint40(0x41712ab74e796f2C79Ee53F3405F4E8d6c30e175eF);

        IERC20(coin).safeTransferFrom(msg.sender, commissionWallet, 4*(10**6));
        if(referrer != address(0)){
            distributeReward(referrer, 25*(10**6), 0);
        }else{
            totalRest += 25*(10**6);
            // IERC20(coin).safeTransferFrom(msg.sender, address(receiptWallet), 25*(10**6));
        }
        // users[msg.sender].registered = true;
        users[msg.sender].referrer = referrer;
    }

    function changeCommissionWallet(address _wallet) external {
        commissionWallet = _wallet;
    }

    function changeReceiptWallet(address _wallet) external {
        receiptWallet = _wallet;
    }

    function distributeReward(address referrer, uint256 amount, uint8 level) internal {
        if(level>4){
            totalRest += amount;
            return;
        }
        users[referrer].referralCommission += roundedDivWith2(amount);
        users[referrer].referralsCount[level]++;
        if(level == 0){
            if(users[referrer].referralsCount[level]>=500){
                if(totalRest>10000){
                    users[referrer].referralCommission += 10000;
                    totalRest -= 10000;
                }                
            }else if(users[referrer].referralsCount[level]>=300){
                if(totalRest>500){
                    users[referrer].referralCommission += 500;
                    totalRest -= 500;
                } 
            }else if(users[referrer].referralsCount[level]>=100){
                if(totalRest>100){
                    users[referrer].referralCommission += 100;
                    totalRest -= 100;
                } 
            }
        }        
        level++;
        if(users[referrer].referrer != address(0))
            distributeReward(users[referrer].referrer, amount - roundedDivWith2(amount), level);
        else
            totalRest += amount - roundedDivWith2(amount);
    }
    function roundedDivWith2(uint256 a) pure internal returns(uint256 b){
        a /= 10**6;
        b=a-a/2;
        b *= 10**6;
    }
    function withdrawReward() external nonReentrant{
        uint256 availableAmount = users[msg.sender].referralCommission - users[msg.sender].withdrawnReward;
        require(availableAmount>0, "no reward");
        IERC20(coin).safeTransfer(msg.sender, availableAmount);
        users[msg.sender].withdrawnReward = users[msg.sender].referralCommission;
    }
    // function withdrawForOwner() external onlyOwner{
    function withdrawForRecipient() external isReceiptWallet{   
        IERC20(coin).safeTransfer(receiptWallet, IERC20(coin).balanceOf(address(this)));
        totalRest = 0;
    }
    function getUser(address _user) external view returns (
        bool registered,
        address referrer,
        uint256 referralCommission,
        uint256 withdrawnReward,
        uint256[5] memory referralsCount
    ){
        registered = users[_user].registered;
        referrer = users[_user].referrer;
        referralCommission = users[_user].referralCommission;
        withdrawnReward = users[_user].withdrawnReward;
        for(uint8 i=0;i<5;i++){
            referralsCount[i] = users[_user].referralsCount[i];
        }
    }
}