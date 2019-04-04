import React from 'react';
import { getStockData } from '../../util/company_api_util';
import { fetchCompanies, getMultipleStockData } from '../../util/company_api_util';
import { fetchTransactions } from '../../util/transaction_api_util';
import { Link } from 'react-router-dom';

class StockIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            numShares: [],
            prices: []}
        this.renderStocks = this.renderStocks.bind(this);
        this.priceHelper = this.priceHelper.bind(this);
        this.percentHelper = this.percentHelper.bind(this);
        this.ajaxHelper = this.ajaxHelper.bind(this);
    }

    componentDidMount () {
        this.ajaxHelper();
        this.intervalId = setInterval(this.ajaxHelper, 10000);
        
    }

    // ajaxHelper () {
    //     fetchCompanies()
    //     .then(companies => {
    //             this.companies = companies;
    //             this.setState({companies: companies})
    //             return getMultipleStockData(this.formatTickers(), '1d');
    //         }).then(data => {
          
    //             this.prices = data
    //             return fetchTransactions();
    //         }).then(transactions => {
           
    //             this.numShares = this.transactionHelper(transactions);
    //             this.setState({ numShares: this.numShares, companies: this.companies, prices: this.prices });
    //     });
    // }

    ajaxHelper() {
        fetchTransactions()
            .then((transactions) => {
                this.numShares = this.transactionHelper(transactions) 
                this.setState({ transactions: transactions, numShares: this.numShares })
            })
            .then(() => fetchCompanies().then(companies => {
         
                this.setState({ companies: this.userCompanies(companies) })
            }))
            .then(() => {
          
                return getMultipleStockData(this.formatTickers(), '1d').then(data => {
           
                    this.setState({ prices: data })
                })
            })
            this.setState();

    }

    userCompanies (companies) {
        let companiesObj = {};
        this.state.transactions.forEach(trans => {
            for (let i = 0; i < companies.length - 1; i++) {
                if (companies[i].id === trans.company_id) {
                    companiesObj[companies[i].ticker] = trans.company_id;
                }
            }
        })
        return companiesObj
    }

    formatTickers() {
        let companiesObj = {};
        this.state.transactions.forEach(trans => {

            let companies = this.state.companies;

            for (let i = 0; i < Object.keys(companies).length; i++) {

                if (companies[Object.keys(companies)[i]] === trans.company_id) {
                    companiesObj[Object.keys(companies)[i]] = trans.company_id;
                }
            }
        })

        let tickers = Object.keys(companiesObj).map(ticker => {
            return ticker.toLowerCase();
        })

        return tickers.join(',')

    }

    componentWillUnmount () {
        clearInterval(this.intervalId);
    }

    transactionHelper (transactions) {
        let sharesObj = {};
        transactions.forEach(trans => {
            if (sharesObj[trans.company_id] === undefined) {
                sharesObj[trans.company_id] = [{
                    transaction_type: trans.transaction_type,
                    shares: trans.shares
                }]
            } else {
                sharesObj[trans.company_id].push({
                    transaction_type: trans.transaction_type,
                    shares: trans.shares
                })
            }
        });
        let numShares = {};
        Object.keys(sharesObj).forEach(id => {
            numShares[id] = 0;
            sharesObj[id].forEach(trans => {
              
                if (trans.transaction_type === 'buy') {
                    numShares[id] += trans.shares
                } else {
                    numShares[id] -= trans.shares
                }
            })
        });
        return numShares;
    }

    priceHelper (prices) {
        let arr = prices.filter((ele) => ele.close);
        let output = arr[arr.length - 1].close;
        return (
            <p id='price'>
                {`$${output.toFixed(2)}`}
            </p>
        )
    }

    percentHelper (prices) {
        let arr = prices.filter((ele) => ele.close);
        let last = arr[arr.length - 1].close;
        let first = arr[0].close
        let difference = (last - first) / first * 100
        let percent = difference.toFixed(2);
        return (
            <p id={percent >= 0 ? 'percent-green' : 'percent-red'}>
                {percent + '%'}
            </p>
        )
    }

    uniqueCompanies (companies) {

        let companiesObj = {};
        Object.keys(companies).forEach(comp => {
            companiesObj[comp] = 1
        });
        return companiesObj;
    }

    renderStocks () {
        let state = this.state;
        if (this.state.companies.length === 0 || this.state.prices.length === 0 || this.state.numShares.length === 0) {
            
            return ''
        } else {
            let companies = this.state.companies;
            let prices = this.state.prices;
            let shares = this.state.numShares;
            debugger
            let stocks = Object.keys(this.uniqueCompanies(this.state.companies)).map((id, idx) => {
                let companyObj = this.uniqueCompanies(this.state.companies);
                debugger;
                // let companyId = companies[id].id;
                let state = this.state;
                let ticker = id;
                return (<li className='stock-li' key={idx}>
                    <Link to={`/stocks/${ticker}`}>
                        <div className='shares-ticker-div'>
                            <p className='ticker'>
                                {id}
                            </p>
                            <p className='shares'>
                                {shares[companies[id]]} Shares
                            </p>
                        </div>
                        <div className='graph-percent-price-div'>
                            {this.percentHelper(prices[id].chart)}
                            {this.priceHelper(prices[id].chart)}
                        </div>
                    </Link>
                </li>)
            })
            return (
                <ul className='stock-index-ul'>
                    {stocks}
                </ul>
            )
        }
        
    }

    render () {
        return (
            <div className='stock-index-div'>
                <h1>Stocks</h1>
                {this.renderStocks()}
            </div>
        );
    }
}

export default StockIndex;