// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract InsuranceClaimProcessing {
    struct Claim {
        address payable patient;
        address hospitalAdmin;
        uint claimAmount;
        bool isBillVerifiedByHospital;
        string nftId;
    }

    struct ClaimDetails {
    uint[] claimIds;
    address[] patients;
    address[] hospitalAdmins;
    uint[] claimAmounts;
    bool[] billVerifications;
    string[] nftIds;
    ClaimStatus[] claimStatuses;
}

    enum ClaimStatus { Submitted, VerifiedByHospital, Processed }

    mapping (uint => Claim) public claims;
    mapping (address => uint[]) public patientClaims;
    mapping (uint => ClaimStatus) public claimsStatus;
    uint public nextClaimId = 1;
    address payable public insuranceCompany;

    event LogBillSubmitted(uint indexed claimId, address indexed patient, string nftId);
    event LogBillVerifiedByHospital(uint indexed claimId, address indexed hospitalAdmin, uint claimAmount);
    event LogClaimProcessed(uint indexed claimId, address indexed insuranceCompany, uint claimAmount);
    event FundsDeposited(uint indexed amount);

    constructor(address payable _insuranceCompany) {
        insuranceCompany = _insuranceCompany;
    }

    function depositFunds() public payable {
        require(msg.sender == insuranceCompany, "Only insurance company can deposit funds");
        emit FundsDeposited(msg.value);
    }

    function submitBill(address _hospitalAdmin, string memory _nftId) public {
        uint claimId = nextClaimId++;
        claims[claimId] = Claim({
            patient: payable(msg.sender),
            hospitalAdmin: _hospitalAdmin,
            claimAmount: 0,
            isBillVerifiedByHospital: false,
            nftId: _nftId
        });
        patientClaims[msg.sender].push(claimId);
        claimsStatus[claimId] = ClaimStatus.Submitted;
        emit LogBillSubmitted(claimId, msg.sender, _nftId);
    }

    // Verify bill & set claimAmount by hospital admin.
    function verifyBillHospital(uint _claimId, uint _claimAmount) public {
        Claim storage claim = claims[_claimId];
        require(msg.sender == claim.hospitalAdmin, "Only hospital admin can verify the bill");
        claim.isBillVerifiedByHospital = true;
        claim.claimAmount = _claimAmount; // Setting claim amount here.
        claimsStatus[_claimId] = ClaimStatus.VerifiedByHospital;
        emit LogBillVerifiedByHospital(_claimId, claim.hospitalAdmin, _claimAmount);
    }

    function processClaim(uint _claimId) public {
        require(msg.sender == insuranceCompany, "Only insurance company can process claims");
        Claim storage claim = claims[_claimId];
        require(claim.isBillVerifiedByHospital, "Hospital must first verify the bill");
        
        require(address(this).balance >= claim.claimAmount, "Contract does not have sufficient funds to process this claim");

        claim.patient.transfer(claim.claimAmount);
        claimsStatus[_claimId] = ClaimStatus.Processed;
        emit LogClaimProcessed(_claimId, insuranceCompany, claim.claimAmount);
    }

   function getPatientClaims(address patient) public view returns (ClaimDetails memory) {
    uint length = patientClaims[patient].length;
    ClaimDetails memory details;

    details.claimIds = new uint[](length);
    details.patients = new address[](length);
    details.hospitalAdmins = new address[](length);
    details.claimAmounts = new uint[](length);
    details.billVerifications = new bool[](length);
    details.nftIds = new string[](length);
    details.claimStatuses = new ClaimStatus[](length);

    for (uint i = 0; i < length; i++) {
        uint claimId = patientClaims[patient][i];
        Claim storage claim = claims[claimId];
        
        details.claimIds[i] = claimId;
        details.patients[i] = claim.patient;
        details.hospitalAdmins[i] = claim.hospitalAdmin;
        details.claimAmounts[i] = claim.claimAmount;
        details.billVerifications[i] = claim.isBillVerifiedByHospital;
        details.nftIds[i] = claim.nftId;
        details.claimStatuses[i] = claimsStatus[claimId];
    }

    return details;
}


    function getClaimStatus(uint _claimId) external view returns (ClaimStatus) {
        return claimsStatus[_claimId];
    }
}
