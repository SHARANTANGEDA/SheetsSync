import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {connect} from 'react-redux'
import TextFieldGroup from "../common/TextFieldGroup";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Switch from "react-switch"
import {addSheet} from "../../actions/homeActions";


class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetName: '',
            spreadSheetLink: '',
            copied: false,
            withLabel: true,
            // structured: true,
            errors: {}
            // columns: [{name:"", type:"", charLength:300, compulsory:true}],
            // names:[],
            // types:[],
            // charLengths: [],
            // compulsory: [],
            // step1: false
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.switchValue = this.switchValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.switchValueStructure = this.switchValueStructure.bind(this)
        // this.addColumn = this.addColumn.bind(this)
        // this.columnChange = this.columnChange.bind(this)
        // this.handleRemove = this.handleRemove.bind(this)
    }

    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    switchValueStructure(structured) {
        this.setState({structured})
    }

    switchValue(withLabel) {
        this.setState({withLabel})
    }


    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.errors);
        if (nextProps) {
            this.setState({errors: nextProps.errors})
        }
    }

    // columnChange(e, index, part) {
    //     this.state.columns[index][part] = e.target.value
    //     console.log(this.state.columns)
    //     this.setState({columns: this.state.columns})
    // }
    // handleRemove(index) {
    //     this.state.columns.splice(index, 1)
    //     this.setState({columns: this.state.columns})
    // }

    onSubmit(e) {
        e.preventDefault();
        const data = {
            sheetName: this.state.sheetName,
            withLabel: this.state.withLabel.toString(),
            spreadSheetLink: encodeURIComponent(this.state.spreadSheetLink)
        };
        // structured: this.state.structured
        console.log({data: data});
        let flag = false
        if (this.state.spreadSheetLink.length===0 || !this.state.spreadSheetLink.startsWith("https://docs.google.com/spreadsheets")) {
            flag = true
            this.state.errors.spreadSheetLink = "Please enter google spreadsheet link in given format"
            this.setState({errors: this.state.errors})
        }
        if (this.state.sheetName.length===0) {
            flag = true
            this.state.errors.sheetName = "Please Enter SheetName"
            this.setState({errors: this.state.errors})
        }
        if(!flag) {
            this.props.addSheet(data)
        }
        // if(this.state.structured) {
        //     this.setState({step1: true})
        // }
        // this.props.loginUser(userData);
    }

    // addColumn() {
    //     console.log("Here")
    //     this.setState({columns: [...this.state.columns,{name:"", type:"", charLength:300, compulsory:true}]})
    //     console.log(this.state.columns)
    // }


    render() {
        const {errors} = this.state;
        console.log(errors)
        let pageContent = (<div className="col-md-6">
            <form noValidate onSubmit={this.onSubmit}>
                <h6 className='d-flex justify-content-start'>Share your google sheet with following
                    email:</h6>
                <div className='row' style={{
                    padding: '5px',
                    borderStyle: 'solid',
                    borderColor: 'white',
                    borderRadius: '5px',
                    margin: '5px'
                }}>
                    <CopyToClipboard text={"sheetssync@sheets-sync-277810.iam.gserviceaccount.com"}
                                     onCopy={() => this.setState({copied: true})}>
                                            <span style={{color: '#ffffff', margin: '5px'}}>sheetssync@sheets-sync-277810.iam.gserviceaccount.com
                                            </span>
                    </CopyToClipboard>
                    <CopyToClipboard text={"sheetssync@sheets-sync-277810.iam.gserviceaccount.com"}
                                     onCopy={() => this.setState({copied: true})}>
                        <button style={{
                            background: '#8d0000',
                            borderStyle: 'none',
                            borderRadius: '5px'
                        }}>{this.state.copied ?
                            "Copied!" : "Copy"}</button>
                    </CopyToClipboard>
                </div>
                <hr/>

                <h6 className='d-flex justify-content-start'>Enter Spreadsheet Link:</h6>
                <TextFieldGroup placeholder="Ex: https://docs.google.com/spreadsheets..."
                                error={errors.spreadSheetLink}
                                type="text" onChange={this.changeHandler}
                                value={this.state.spreadSheetLink}
                                name="spreadSheetLink"
                />
                <h6 className='d-flex justify-content-start'>Enter Sheet Name:</h6>

                <TextFieldGroup placeholder="Ex: Sheet1" error={errors.sheetName}
                                type="text" onChange={this.changeHandler}
                                value={this.state.sheetName} name="sheetName"
                />
                <div className='row d-flex justify-content-around'>
                    <h6 style={{marginRight: '5px'}}>Does the First Row in the sheet contain
                        Labels?</h6>
                    <Switch width={75} height={30} handleDiameter={20}
                            checkedIcon={<span
                                style={{margin: '5px', fontWeight: 'bold'}}>Yes</span>}
                            uncheckedIcon={<span
                                style={{margin: '5px', fontWeight: 'bold'}}>No</span>}
                            onChange={this.switchValue} checked={this.state.withLabel}/>
                </div>
                <hr/>
                {/*<div className='row d-flex justify-content-between'>*/}
                {/*    <h6 style={{marginRight: '5px'}}>Do you want to use Structured Data Sync*/}
                {/*        <span*/}
                {/*            style={{fontStyle: 'italic', fontWeight: 'bolder'}}>(Recommended)</span>?*/}
                {/*    </h6>*/}
                {/*    <Switch width={75} height={30} handleDiameter={20}*/}
                {/*            checkedIcon={<span*/}
                {/*                style={{margin: '5px', fontWeight: 'bold'}}>Yes</span>}*/}
                {/*            uncheckedIcon={<span*/}
                {/*                style={{margin: '5px', fontWeight: 'bold'}}>No</span>}*/}
                {/*            onChange={this.switchValueStructure} checked={this.state.structured}/>*/}
                {/*</div>*/}
                <div className="col-md-12 d-flex justify-content-center text-center">
                    <div className='col-md-6'>
                        <button style={{
                            maxWidth: '250px',
                            background: '#8d0000',
                            borderStyle: 'none',
                            borderRadius: '8px',
                            fontSize: '14pt'
                        }}
                                className="btn btn-info btn-block mt-4"
                                onClick={this.onSubmit}>Start Syncing
                        </button>
                    </div>
                </div>
                <hr/>
            </form>

            <hr/>
        </div>)
        /*if(this.state.step1) {
        //     pageContent = (
        //         <div>
        //             <h5>Step-2: Add the Column Structure to start Sync</h5>
        //             <hr/>
        //             <h6 style={{fontStyle:'italic', fontWeight:'bolder'}}> Ensure that column name order is correct this may have problem while syncing data</h6>
        //             <hr/>
        //             {
        //                 this.state.columns.map((column, idx) => {
        //                     return (
        //                         <div key={idx}>
        //                             <input className='form-control' placeholder="Ex: https://docs.google.com/spreadsheets..."
        //                                    onChange={(e) => this.columnChange(e, idx, "name")}
        //                                    value={column.name} type="text"/>
        //                             <button onClick={() => this.handleRemove(idx)}>Remove</button>
        //                         </div>
        //                     )
        //                 })
        //             }
        //             <button onClick={(e) =>this.addColumn(e)}>Add Column</button>
        //         </div>
        //
        //     )
        //
        // }else {
        //     pageContent = (

        //     )
        // }

         */

        return (
            <div className="login landing " style={{maxHeight: '100%'}}>
                <div className="dark-overlay">
                    <div className="container">
                        <div className="row  text-light">
                            <div className="col-md-12 text-center">
                                <h1 className="display-3 mb-4"
                                    style={{color: 'white', fontFamily: 'roboto'}}>Google Spreadsheet Sync</h1>
                                <p className="lead" style={{color: 'white', fontFamily: 'roboto'}}>
                                    {' '}
                                    Fill the following details to sync new sheet
                                </p>
                                <hr/>
                            </div>
                            <div className='col-md-12 d-flex justify-content-center text-center'>
                                    {pageContent}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired,
    addSheet: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {addSheet})(Landing);
