pragma solidity ^0.8.19;

contract Predictionmarket {
    enum Team {TeamA, TeamNotA }
    struct Result {
        Team winner;
        Team loser;
    }
    Result public result;
    address public oracle;

    // accounts for total amt gambled on each Team
    mapping(Team => uint) public bets;
    mapping(address => mapping(Team => uint)) public betsPerGambler;
    bool public assignmentGraded;

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function placeBet(Team _team) external payable {
        require(assignmentGraded == false, 'assignment has been graded already.');
        // update the maps with the new bet
        bets[_team] += msg.value;
        betsPerGambler[msg.sender][_team] += msg.value;
    }

    function withdrawGain(address payable recipient) external {
        require(recipient == msg.sender, "Only address owner can withdraw their gains.");
        uint gamblerBet = betsPerGambler[msg.sender][result.winner];
        require(gamblerBet > 0, 'You did not bet on the winning outcome.');
        require(assignmentGraded == true, 'Assignment has not been graded');
        // all gamblers who bet on the winning outcome receive their stake back, thus the winners are entitled to a stake from the losing pool proportional to their stake in the winning pool
        uint gain = gamblerBet + bets[result.loser]*gamblerBet / bets[result.winner];
        // reset bets back to 0
        betsPerGambler[msg.sender][Team.TeamA] = 0;
        betsPerGambler[msg.sender][Team.TeamNotA] = 0;
        // send funds
        (bool sent, bytes memory data) = recipient.call{value: gain}("");
        require(sent, "Failed to send Ether");
    }

    function reportResult(Team _winner, Team _loser) external {
        require(oracle == msg.sender, 'ONLY THE ORACLE CAN REPORT. NICE TRY!');
        require(assignmentGraded == false, 'Assignment has already been graded.');
        result.winner = _winner;
        result.loser = _loser;
        assignmentGraded = true;
    }

}
