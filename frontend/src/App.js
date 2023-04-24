import logo from './logo.svg';
import getBlockchain from './ethereum';
import {Pie} from 'react-chartjs-2';
// adapted from: https://github.com/jklepatch/eattheblocks/blob/master/screencast/244-prediction-market-us-elections/frontend/src/App.js

const TEAM = {
    A: 0,
    NOT_A: 1
};

function App() {
    const [predictionMarket, setPredictionMarket] = useState(undefined);
    const [myBets, setMyBets] = useState(undefined);
    const [betPredictions, setMyBetPredictions] = useState(undefined);
    useEffect( () => {
        const init = async () => {
            const { signerAddress, predictionMarket} = await getBlockchain();
            const bets = await Promise.all(
                predictionMarket.bets(TEAM.A),
                predictionMarket.bets(TEAM.NOT_A),
            );

            const betPredictions = {
                labels: [
                    'A',
                    'NOT_A',
                ],
                datasets: [{
                    data: [ethers.utils.formatEther(bets[0]).toString(), ethers.utils.formatEther(bets[1]).toString()],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                    ]
                }]
            };

            const myBets = await Promise.all([
                predictionMarket.betsPerGambler(signerAddress, TEAM.A),
                predictionMarket.betsPerGambler(signerAddress, TEAM.NOT_A)
            ]);

            setMyBetPredictions(betPredictions);
            setPredictionMarket(predictionMarket);
            setMyBets(myBets);
        };
        init();
    }, []);

    if(
        typeof predictionMarket == 'undefined' || typeof myBets == 'undefined' || typeof betPredictions == 'undefined'
    ) { return 'Loading...'; }

    const placeBet = async(team, e) => {
        e.preventDefault(); // prevent form submit
        await predictionMarket.placeBet(
            side,
            {value: e.target.elements[0].value}
        )
    }

    const withdrawGain = async() => {
        await predictionMarket.withdrawGain();
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-sm-12'>
                <h1 className='text-center'>Prediction Market</h1>
                <div className="jumbotron">
                    <h1 className="display-4 text-center">Who will win the US election?</h1>
                    <p className="lead text-center">Current odds</p>
                    <div>
                        <Pie data={betPredictions}/>
                    </div>
                </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-sm-6'>
                <div className="card">
                    <img src='./img/trump.png' />
                    <div className="card-body">
                    <h5 className="card-title">Of course they will!</h5>
                    <form className="form-inline" onSubmit={e => placeBet(TEAM.A, e)}>
                        <input
                        type="text"
                        className="form-control mb-2 mr-sm-2"
                        placeholder="Bet amount (ether)"
                        />
                        <button
                        type="submit"
                        className="btn btn-primary mb-2"
                        >
                        Submit
                        </button>
                    </form>
                    </div>
                </div>
                </div>

                <div className='col-sm-6'>
                <div className="card">
                    <img src='./img/biden.png' />
                    <div className="card-body">
                    <h5 className="card-title">I don't think so...</h5>
                    <form className="form-inline" onSubmit={e => placeBet(TEAM.NOT_A, e)}>
                        <input
                        type="text"
                        className="form-control mb-2 mr-sm-2"
                        placeholder="Bet amount (ether)"
                        />
                        <button
                        type="submit"
                        className="btn btn-primary mb-2"
                        >
                        Submit
                        </button>
                    </form>
                    </div>
                </div>
                </div>
            </div>

            <div className='row'>
                <h2>Your bets</h2>
                <ul>
                    <li>Team <em>A:</em> {myBets[0].toString()} ETH (wei)</li>
                    <li>Team <em>NOT_A:</em> {myBets[1].toString()} ETH (wei)</li>
                </ul>
            </div>

            <div className='row'>
            <h2>Claim your gains, if any, after the election</h2>
            <button
                type="submit"
                className="btn btn-primary mb-2"
                onClick={e => withdrawGain()}
            >
                Submit
            </button>
            </div>
        </div>
    );
}

export default App;
