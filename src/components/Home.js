
import { useEffect, useState } from "react";
import axios from 'axios';
import dash from '../images/dash.png';
import defi from '../images/defi.png';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [refresh, refreshData] = useState(true);
    const [coinCount, setCoins] = useState(null);
    const [coinTypes, setTypes] = useState(null);
    const [defiTotal, setDefiTotal] = useState(0);
    const [dashTotal, setDashTotal] = useState(0);
    const [AUM, setAUM] = useState(0);
    const DASH = "Dash";
    const DASHCODE = "DASH";
    const DEFI = "DeFi";
    const DEFICODE = "DFI";

    const makeMasterNodesCall = (resolve, reject) => {
        axios.get('https://api.cakedefi.com/nodes?order=status&orderBy=DESC')
            .then(async response => {
                const coinDict = {
                    "DFI": 0,
                    "DASH": 0,
                };
                response.data.forEach((obj) => {
                    const coin = obj.coin;
                    if (coin == DEFI) {
                        coinDict[DEFICODE] += 1;
                    } else if (coin == DASH) {
                        coinDict[DASHCODE] += 1;
                    }
                });
                setCoins(coinDict);
            })
            .catch(error => console.error(error));
    }

    const makeCoinBaseCall = async (resolve, reject) => {
        await axios.get('http://localhost:8080/proxy', {
            params: {
                symbols: coinTypes
            }
        }).then(async response => {
            const coinPrices = response.data.data;
            const dashInfo = coinPrices.DASH.filter(obj => obj.name === "Dash")[0];
            const defiInfo = coinPrices.DFI.filter(obj => obj.name === "DeFiChain")[0];

            const dashTotal = await parseFloat((dashInfo.quote.USD.price * coinCount[DASHCODE] * 1000).toFixed(2));
            const defiTotal = await parseFloat((defiInfo.quote.USD.price * coinCount[DEFICODE] * 20000).toFixed(2));
            const AUM = await parseFloat(dashTotal + defiTotal).toFixed(2);
            setDashTotal(dashTotal);
            setDefiTotal(defiTotal);
            setAUM(AUM);
            setLoading(false);
        }).catch(err => console.log(err));
    }

    // onInit
    useEffect(() => {
        // Start of http chain
        setLoading(true);
        makeMasterNodesCall();
    }, [refresh])

    useEffect(() => {
        if (coinCount) {
            setTypes(Object.keys(coinCount));
        }
    }, [coinCount]);

    useEffect(() => {
        if (coinTypes) {
            makeCoinBaseCall();
        }
    }, [coinTypes]);

    function handleClick() {
        refreshData(!refresh);
    }


    if (loading) {
        console.log("RENDERING")
        return <div>Loading...</div>;
    }

    return (
        // Shorthand for <Fragment>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Asset</th>
                    <th scope="col">Total value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>
                        <img src={dash} alt="Dash" />Dash
                    </td>
                    <td>{dashTotal}</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>
                        <img src={defi} alt="Defi" />Defi
                    </td>
                    <td>{defiTotal}</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Dash + Defi</td>
                    <td>{AUM}</td>
                </tr>
                <tr>
                    <th scope="row"></th>
                    <td><button onClick={handleClick}>Refresh data!</button></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    )
}

export default Home;