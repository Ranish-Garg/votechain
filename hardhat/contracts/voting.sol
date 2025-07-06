pragma solidity ^0.8.0;

contract voting 
{
    candidate[] public candidates;
  

    struct candidate
    {
        string candidatename;
        string image;
        uint256 votes;
    }
    mapping (address => bool) public hasvoted ;
    uint256  public votingstart;
    uint256 public votingend;
    address public  owner;

   constructor(string[] memory _candidatename,string[] memory _candidateimage ,uint256 _durationinminutes){
    for (uint i = 0 ; i < _candidatename.length ; i++) { 
        candidates.push(candidate({
            candidatename: _candidatename[i],
            image : _candidateimage[i], 
            votes : 0
        }));
    }
        votingstart = block.timestamp;
        votingend = block.timestamp + (_durationinminutes *1 minutes);
        owner = msg.sender;
    
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

   function getAllVotesOfCandidates() public view returns (
    string[] memory, 
    string[] memory, 
    uint256[] memory
) {
    string[] memory names = new string[](candidates.length);
    string[] memory images = new string[](candidates.length);
    uint256[] memory votes = new uint256[](candidates.length);

    for (uint i = 0; i < candidates.length; i++) {
        candidate storage c = candidates[i];
        names[i] = c.candidatename;
        images[i] = c.image;
        votes[i] = c.votes;
    }

    return (names, images, votes);
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
