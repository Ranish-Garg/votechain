pragma solidity ^0.8.0;

contract voting 
{
    candidate[] public candidates;
  

    struct candidate
    {
        string metadatauri;
        uint256 votes;
    }
    mapping (address => bool) public hasvoted ;
    uint256  public votingstart;
    uint256 public votingend;
    address public  owner;

   constructor(string[] memory _metadatauri ,uint256 _durationinminutes){
    for (uint i = 0 ; i < _metadatauri.length ; i++) { 
        candidates.push(candidate({
            metadatauri: _metadatauri[i], 
            votes : 0  
        }));
    }
        votingstart = block.timestamp;
        votingend = block.timestamp + (_durationinminutes *1 minutes);
        owner = msg.sender;
    
   }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function castvote(uint256 _candidateindex) public 
    {
        require(hasvoted[msg.sender]==false,"Already voted");
        require(_candidateindex < candidates.length,"invalid index of candidate");
          candidates[_candidateindex].votes++;
        hasvoted[msg.sender] = true;

    }

    function getvotingstatus() public view returns(bool)
    {
        return (block.timestamp>= votingstart && block.timestamp <= votingend);
    } 

    function getAllVotesOfCandiates() public view returns (candidate[] memory){
        return candidates;
    }

    function getremainingtime() public view returns(uint256)
    {
        require(block.timestamp>=votingstart,"not started yet");
          if (block.timestamp >= votingend) {
            return 0;
        }

        return votingend - block.timestamp ;
    }

}
