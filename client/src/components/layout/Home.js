import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {PropTypes} from 'prop-types'
import {connect} from 'react-redux'
import 'react-datepicker/dist/react-datepicker.css'
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import {deleteSheet, getHomeData, openSheet, pauseSync, restartSync} from "../../actions/homeActions";
import Spinner from "../common/Spinner";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TablePagination from "@material-ui/core/TablePagination";
import Modal from 'react-modal'

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    container: {
        maxHeight: 440,
    },

}));

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '0',
        transform: 'translate(-50%, -50%)',
        background:'#b30000'
    }
};


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            setPage: 0,
            rowsPerPage: 15,
            setRowsPerPage: 15,
            errors: {},
            deleteId: -1,
            modalIsOpen: false,
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.stopSync = this.stopSync.bind(this)
        this.restartSync = this.restartSync.bind(this)
        this.TablePaginationAction = this.TablePaginationAction.bind(this)
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.deleteTable = this.deleteTable.bind(this)
    }

    TablePaginationAction(props) {
        const classes = useStyles1();
        const theme = useTheme();
        const {count, page, rowsPerPage, onChangePage} = props;
        console.log("TEST:", count, page, rowsPerPage, onChangePage)
        const handleFirstPageButtonClick = (event) => {
            onChangePage(event, 0);
        };
        const handleBackButtonClick = (event) => {
            onChangePage(event, page - 1);
        };
        const handleNextButtonClick = (event) => {
            console.log("event")

            onChangePage(event, page + 1);
        };
        const handleLastPageButtonClick = (event) => {
            onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };
        return (
            <div className={classes.root}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
                </IconButton>
            </div>
        );
    }

    openModal(id) {
        this.setState({modalIsOpen: !this.state.modalIsOpen, deleteId: id})
    }
    closeModal() {
        this.setState({modalIsOpen: false, deleteId: -1})
    }
    afterOpenModal() {

    }
    deleteTable() {
        console.log("SET", this.state.deleteId)
        this.props.deleteSheet(this.state.deleteId)
    }

    restartSync(id) {
        this.props.restartSync(id)
    }
    stopSync(id) {
        this.props.pauseSync(id)
    }

    componentDidMount() {
        this.props.getHomeData(this.props.match.params.id)
    }

    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
            console.log(nextProps.errors)
        }
    }

    onSubmit(e) {
        e.preventDefault();
    }

    handleChangePage(event, newPage) {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage(event) {
        this.setState({rowsPerPage: parseInt(event.target.value, 10), setPage: 0})

    };

    useStyles = makeStyles({
        table: {
            minWidth: 650
        },
        container: {
            maxHeight: "400px",
        }
    });

    render() {
        const {errors, page, setPage, rowsPerPage, setRowsPerPage} = this.state;
        const {home, loading} = this.props.home
        let content = null
        let modalContent = (
            <div id="mainbar" className='row d-flex justify-content-start'>
                <div className="col-md-12 d-flex justify-content-between" style={{width: '100%', margin: '5px'}}>
                   <h5 style={{color:'#ffffff'}}> Please confirm to remove the entire sheet</h5>
                    <button onClick={this.closeModal} className='btn btn-sm' style={{background: 'none', border:'none', color: '#ffffff'}}>
                        <i className="fas fa-times fa-2x"/>
                    </button>
                </div>
                <h6 style={{color:'#ffffff'}}>This operation cannot be reversed!!!</h6>
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-info' style={{
                        background: '#b30000', color: '#ffffff',
                        borderStyle: 'none', borderRadius: '5px', marginRight:'20px'
                    }} onClick={this.deleteTable}>
                        <i className="fas fa-trash"/>{' '}Remove
                    </button>
                    <button className='btn btn-info' style={{
                        background: '#34a500', color: '#ffffff',
                        borderStyle: 'none', borderRadius: '5px'
                    }} onClick={this.closeModal}>
                        Cancel
                    </button>

                </div>
            </div>
        );
        if (loading || home === null || home === []) {
            content = (<Spinner/>)
        } else {
            console.log({CONTENT: home})//
            const emptyRows = rowsPerPage - Math.min(rowsPerPage, home.length - page * rowsPerPage)
            content = (
                <TableContainer className={this.useStyles.container} component={Paper}>
                    <Table stickyHeader className={this.useStyles.table} aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{minWidth: '30px', maxWidth: '30px'}}>SL.No</TableCell>
                                <TableCell align="left" style={{minWidth: '75px', maxWidth: '150px'}}>Spreadsheet
                                    ID</TableCell>
                                <TableCell align="left" style={{minWidth: '40px', maxWidth: '50px'}}>Sheet
                                    Name</TableCell>
                                <TableCell align="left">Number of Columns</TableCell>
                                <TableCell align="left">State</TableCell>
                                <TableCell align="left">Has Label</TableCell>
                                <TableCell align="left" style={{minWidth: '125px'}}>View Sheet Data</TableCell>
                                <TableCell align="left" style={{minWidth: '125px'}}>Manage Sync</TableCell>
                                <TableCell align="left" style={{minWidth: '125px'}}>Delete Sheet</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? home.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : home).map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell style={{
                                        whiteSpace: "wrap", maxWidth: '150px',
                                        overflow: "hidden", textOverflow: "ellipsis"
                                    }} align="left">{row.spreadsheetid}</TableCell>
                                    <TableCell align="left">{row.sheetname}</TableCell>
                                    <TableCell align="left">{row.cols}</TableCell>
                                    <TableCell align="left">
                                        {row.state === 1 ? <span style={{color: '#34a500'}}>
                                            <i className="fas fa-sync"/>{' '}Syncing</span> :
                                            <span style={{color: '#1e1e1e'}}><i
                                                className="fas fa-pause"/>{' '}Paused</span>}</TableCell>
                                    <TableCell align="left">{row.hasLabel === 1 ? "Yes" : "No"}</TableCell>

                                    <TableCell align="left">
                                        <Link to={`/openSheet/${row.id}/${row.cols}`} className='btn btn-info' style={{
                                            background: '#001aff', color: '#ffffff',
                                            borderStyle: 'none', borderRadius: '5px'
                                        }}
                                        >Open
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{row.state === 1 ?
                                        <button className='btn btn-info'
                                                style={{
                                                    background: '#545454', color: '#ffffff',
                                                    borderStyle: 'none', borderRadius: '5px'
                                                }} onClick={() => this.props.pauseSync(row.id)}
                                        ><i className="fas fa-pause"/>{' '}Pause</button> :
                                        <button className='btn btn-info'
                                                style={{
                                                    background: '#34a500', color: '#ffffff',
                                                    borderStyle: 'none', borderRadius: '5px'
                                                }} onClick={() => this.props.restartSync(row.id)}
                                        ><i className="fas fa-sync"/>{' '}Restart</button>}</TableCell>
                                    <TableCell align="left">
                                        <button className='btn btn-info' style={{
                                            background: '#b30000', color: '#ffffff',
                                            borderStyle: 'none', borderRadius: '5px'
                                        }} onClick={() => this.openModal(row.id)}>
                                            <i className="fas fa-trash"/>{' '}Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 30 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter aria-label="sticky table">
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                                    colSpan={9}
                                    count={home.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {'aria-label': 'rows per page'},
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={this.TablePagination}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )
        }


        return (
            <div className="register landing" style={{maxHeight: '100%'}}>
                <div className='dark-overlay' style={{maxHeight: '100%'}}>
                    <div className="container-fluid " style={{maxHeight: '100%'}}>
                        <div className="row col-md-12">
                            <div className='row col-md-12 d-flex justify-content-center'>
                                <h1 className=" col-md-12  text-center" style={{color: 'white'}}>All Registered Google
                                    Sheets</h1>

                            </div>
                            <div className='col-md-12'>
                                {content}
                            </div>

                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Confirm Delete"
                        shouldCloseOnEsc={false}
                        ariaHideApp={false}
                    >{modalContent}</Modal>
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    getHomeData: PropTypes.func.isRequired,
    pauseSync: PropTypes.func.isRequired,
    restartSync: PropTypes.func.isRequired,
    openSheet: PropTypes.func.isRequired,
    home: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    deleteSheet: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    home: state.home,
    errors: state.errors,
});

export default connect(mapStateToProps, {getHomeData, pauseSync, restartSync, openSheet, deleteSheet})(withRouter(Home))