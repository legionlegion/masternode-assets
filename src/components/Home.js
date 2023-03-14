import { useEffect, useState } from "react";
import prices from '../prices.json';

const Home = () => {
    const [currency, setCurrency] = useState("USD");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [coins, setCoins] = useState(null);

    const makeMasterNodesCall = async (resolve, reject) => {
        fetch('https://api.cakedefi.com/nodes?order=status&orderBy=DESC')
        .then(response => response.json())
        .then(response => {
            let coinDict = {};
            response.forEach((obj) => {
                const coin = obj.coin;
                if (coin in coinDict) {
                    coinDict[coin] += 1;
                } else {
                    coinDict[coin] = 1;
                }
            });
            setCoins(coinDict);
            console.log("Coin dictionary:", coinDict);
            makeCoinBaseCall();
        })
        .catch(error => console.error(error));
    }

    const makeCoinBaseCall = async (resolve, reject) => {
        let response = null;
        try {
            // API is free and has limited calls
            // response = await fetch('http://localhost:8080/proxy', {
            //     headers: {
            //         'X-CMC_PRO_API_KEY': '41166ed1-59cc-480e-9bf5-174b5090dbe8',
            //     },
            // });
            // console.log("Response:", response);
            response = prices
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            console.log("COIN PRICES", json);
            setLoading(false);
            return json;
        }
    }

    useEffect(() => {
        // Masternode data
        makeMasterNodesCall();
    }, [])

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
                    <td>Dash</td>
                    <td></td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>DeFi</td>
                    <td></td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>All</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    )
}

export default Home;