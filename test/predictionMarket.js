require("web3");
const PredictionMarket = artifacts.require('PredictionMarket.sol');

const TEAM = {
    A: 0,
    NOT_A: 1
};

contract('PredictionMarket', addresses => {
    const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

    // begin tests

    it("hmm", async () => {
        // deply contract
        const predictionMarket = await PredictionMarket.new(oracle);
        // Team A
        await predictionMarket.placeBet(
            TEAM.A,
            {from: gambler1, value: web3.utils.toWei('1')}
        );

        await predictionMarket.placeBet(
            TEAM.A,
            {from: gambler2, value: web3.utils.toWei('2')}
        );

        await predictionMarket.placeBet(
            TEAM.A,
            {from: gambler3, value: web3.utils.toWei('3')}
        );
        // Not A
        await predictionMarket.placeBet(
            TEAM.NOT_A,
            {from: gambler4, value: web3.utils.toWei('6')}
        );

        await predictionMarket.reportResult(
            TEAM.A, // winner
            TEAM.NOT_A, // loser
            {from: oracle}
        );

        const balancesBefore = (await Promise.all(
            [gambler1, gambler2, gambler3, gambler4].map(gambler => (
                web3.eth.getBalance(gambler)
            ))
        ))
        .map(balance => web3.utils.toBN(balance));
        await Promise.all(
            [gambler1, gambler2, gambler3].map(gambler => {
                console.log(gambler)
                predictionMarket.withdrawGain(gambler, {from: gambler})
            })
        );
        const balancesAfter = (await Promise.all(
            [gambler1, gambler2, gambler3, gambler4].map(gambler => (
                web3.eth.getBalance(gambler)
            ))
        ))
        .map(balance => web3.utils.toBN(balance));

        // console.log(balancesBefore)
        // console.log(balancesAfter)
        // gambler1 gain = 1 + 6 * 1/6 - txn_fee = 2 - txn_fee
        assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0,3) === "199", balancesAfter[0].sub(balancesBefore[0]).toString().slice(0,3) + " Gambler 1 winnings inaccurate.")

        // gambler2 gain = 2 + 6 * 2/6 - txn_fee = 4 - txn_fee
        assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0,3) === "399")

        // gambler3 gain = 3 + 6 * 3/6 - txn_fee = 6 - txn_fee
        assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0,3) === "599")

        // gambler4 lost
        assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
    })
});