import { getStockData, fetchCompany, createCompany, fetchCompanies, sendPortData } from '../../actions/company_actions';
import { fetchTransactions } from '../../actions/transaction_actions';
import { connect } from 'react-redux';
import Graph from './graph_component';
import {sendSharesData} from '../../actions/session_actions';
import { startLoad, stopLoad } from '../../actions/ui_actions';

const msp = state => ({
    user: state.entities.users[state.session.id],
    transactions: state.entities.transactions,
    companies: state.entities.companies,
    data: state.entities.data,
});

const mdp = dispatch => ({
    getStockData: (ticker, time) => dispatch(getStockData(ticker, time)),
    fetchCompany: (id) => dispatch(fetchCompany(id)),
    createCompany: (company) => dispatch(createCompany(company)),
    fetchTransactions: () => dispatch(fetchTransactions()),
    fetchCompanies: () => dispatch(fetchCompanies()),
    sendPortData: (data) => dispatch(sendPortData(data)),
    sendSharesData: (numShares) => dispatch(sendSharesData(numShares)),
    startLoad: () => dispatch(startLoad()),
    stopLoad: () => dispatch(stopLoad())
});

export default connect(msp, mdp)(Graph);