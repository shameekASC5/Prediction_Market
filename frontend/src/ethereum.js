import { Contract} from 'ethers';
import PredictionMarket from './contracts/Predictionmarket.json';
const ethers = require("ethers")
const getBlockchain = () => 
    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            // check metamask injection
            if (window.ethereum) {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const signerAddress = await signer.getAddress();

                const predictionMarket = new Contract(
                    // find current network
                    "0xc4477D2f93a4ed85190d4fea5353ab0D5BfB0f9C",
                    PredictionMarket.abi,
                    signer
                );

                resolve({signerAddress, predictionMarket});
            }
        })
    })
export default getBlockchain;