import React from 'react';
import { getMultipleStockData } from '../../util/company_api_util';
import { Link } from 'react-router-dom';


class Watchlist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {companies: this.props.items, prices: []};
        this.renderWatchlist = this.renderWatchlist.bind(this);
        this.priceHelper = this.priceHelper.bind(this);
        this.percentHelper = this.percentHelper.bind(this);
        this.moneyFormat = this.moneyFormat.bind(this);
        this.uniqueCompanies = this.uniqueCompanies.bind(this);
    }

    formatCompanies () {
        let array = Object.values(this.state.companies).map(ele => {
            return ele.ticker.toLowerCase();
        });
        return array.join(',');
    }
    
    componentDidMount () {
        this.props.fetchWatchlistIndex().then(() => {
            this.setState({companies: this.props.items})
            getMultipleStockData(this.formatCompanies(), '1d').then(data => {
                this.setState({ prices: data })
            });
        })
    }

    priceHelper(prices) {
        let arr = prices.filter((ele) => ele.close);
        let output = arr[arr.length - 1].close;
        return (
            <p id='price'>
                {`${this.moneyFormat(output)}`}
            </p>
        )
    }

    moneyFormat(num) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(num);
    }

    percentHelper(prices) {
        let arr = prices.filter((ele) => ele.close);
        let last = arr[arr.length - 1].close;
        let first = arr[0].close
        let difference = (last - first) / first * 100
        let percent = difference.toFixed(2);
        if (percent === undefined) {
            return "0.00%"
        } else {
            return (
                <p id={percent >= 0 ? 'percent-green' : 'percent-red'}>
                    {percent + '%'}
                </p>
            )
        }
    }

    uniqueCompanies(companies) {
        let companiesObj = {};
        Object.keys(companies).forEach(comp => {
            if (companiesObj[comp.company_id] === undefined) {
                companiesObj[comp.company_id] = comp
            }
        });
        return companiesObj;
    }

    renderWatchlist () {
        let prices;
        let lis = Object.values(this.uniqueCompanies(this.state.companies)).map((ele, idx) => {
            debugger;
            prices = this.state.prices;
            return(<li className='stock-li' key={idx}>
                <Link to={`/stocks/${ele.ticker}`}>
                    <div className='shares-ticker-div'>
                        <p className='ticker'>
                            {ele.ticker}
                        </p>
                    </div>
                    <div className='graph-percent-price-div'>
                        {this.percentHelper(prices[ele.ticker.toUpperCase()].chart)}
                        {this.priceHelper(prices[ele.ticker.toUpperCase()].chart)}
                    </div>
                </Link>
            </li>)
        })
        return (
            <ul className='stock-index-ul'>
                {lis}
            </ul>
        )
    }

    render () {
        if (this.state.prices.length === 0) {
            return ''
        } else {
            return (
                <div className='watchlist-div'>
                    <h1>Watch List</h1>
                    {this.renderWatchlist()}
                </div>
            )
        }
    }
}

export default Watchlist;