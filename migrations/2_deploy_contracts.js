require("web3");

const PredictionMarket = artifacts.require('PredictionMarket.sol');

const TEAM = {
    A: 0,
    NOT_A: 1
};

module.exports = async function(deployer, _network, addresses) {
    const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

    await deployer.deploy(PredictionMarket, oracle);
    const predictionMarket = await PredictionMarket.deployed();

    await predictionMarket.placeBet(
        TEAM.A,
        {from: gambler1, value: web3.utils.toWei('1')}
    );

    await predictionMarket.placeBet(
        TEAM.A,
        {from: gambler2, value: web3.utils.toWei('1')}
    );

    await predictionMarket.placeBet(
        TEAM.A,
        {from: gambler3, value: web3.utils.toWei('2')}
    );

    await predictionMarket.placeBet(
        TEAM.NOT_A,
        {from: gambler4, value: web3.utils.toWei('3')}
    );
}