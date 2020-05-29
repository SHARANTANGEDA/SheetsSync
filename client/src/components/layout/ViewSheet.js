import React, {Component} from 'react'
import {Link} from 'react-router-dom'
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
// import {TablePagination} from './TablePagination';
import {openSheet} from "../../actions/homeActions";
import Spinner from "../common/Spinner";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TablePagination from "@material-ui/core/TablePagination";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    container: {
        maxHeight: 440,
    },

}));

class ViewSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            setPage: 0,
            rowsPerPage: 15,
            setRowsPerPage: 15,
            errors: {}
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
        this.openSheet = this.openSheet.bind(this)
        this.TablePaginationAction = this.TablePaginationAction.bind(this)
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
    openSheet(id, cols) {
        this.props.openSheet(id, cols)
    }

    componentDidMount() {
        this.props.openSheet(this.props.match.params.id, this.props.match.params.cols)
    }

    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value})
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
        const {sheet, loadSheet} = this.props.home
        let content = null

        if (loadSheet || sheet === null || sheet === []) {
            content = (<Spinner/>)
        } else {
            console.log({CONTENT: sheet})//
            const emptyRows = rowsPerPage - Math.min(rowsPerPage, sheet.length - page * rowsPerPage)
            let headerContent = [null]
            for(let i=1; i<this.props.match.params.cols;i++) {
                headerContent.push(<TableCell align="left">Column{i}</TableCell>)
            }
            content = (
                <TableContainer className={this.useStyles.container} component={Paper} style={{maxHeight:'600px'}}>
                    <Table stickyHeader className={this.useStyles.table} aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{minWidth: '30px', maxWidth: '30px'}}>SL.No</TableCell>
                                {
                                    headerContent.map(item => item)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? sheet.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : sheet).map((row, idx) => (
                                <TableRow key={idx}>
                                    {
                                        row.map((item, idx) => (
                                            <TableCell key={idx} align="left">{item}</TableCell>
                                        ))}
                                    <TableCell component="th" scope="row">
                                        {row.id}
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
                                    colSpan={this.props.match.params.cols}
                                    count={sheet.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {'aria-label': 'rows per page'},
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={this.TablePaginationAction}
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
                            <div className='row col-md-12 '>
                                <div className='d-flex justify-content-start'>
                                    <Link to='/home' style={{color:'#ffffff'}}>
                                    <i className="fas fa-arrow-circle-left"/>{' '}Back to Home</Link>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <h1 className=" col-md-12  text-center" style={{color: 'white'}}>All Registered Google
                                        Sheets</h1>
                                </div>


                            </div>
                            <div className='col-md-12'>
                                {content}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ViewSheet.propTypes = {
    openSheet: PropTypes.func.isRequired,
    home: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    home: state.home,
    errors: state.errors,
});

export default connect(mapStateToProps, {openSheet})(ViewSheet)