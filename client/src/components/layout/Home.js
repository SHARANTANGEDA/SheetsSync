import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {PropTypes} from 'prop-types'
import {connect} from 'react-redux'
import TextFieldGroup from '../common/TextFieldGroup'
import 'react-datepicker/dist/react-datepicker.css'
import {sendLink} from "../../actions/authActions";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '0',

        transform: 'translate(-50%, -50%)'
    }
};

class Home extends Component {
    constructor () {
        super();
        this.state = {
            spreadSheetLink: '',
            errors: {}
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    changeHandler (e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    componentDidMount () {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard')
        }
    }
    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors })
            console.log(nextProps.errors)
        }
    }
    onSubmit (e) {
        e.preventDefault();
        const newUser = {
            spreadSheetLink: this.state.spreadSheetLink,
        };
        this.props.sendLink(newUser);
    }

    render () {
        const { errors } = this.state;
        return (
            <div className="register landing" style={{ maxHeight: '100%' }}>
                <div className='dark-overlay' style={{ maxHeight: '100%' }}>
                    <div className="container-fluid " style={{ maxHeight: '100%' }}>
                        <div className="row col-md-12">
                            <div className='row col-md-12 d-flex justify-content-center'>
                                <h1 className=" col-md-12  text-center" style={{ color: 'white' }}>Enter Sheet Name</h1>
                                <p className="col-md-12  lead text-center" style={{ color: 'white' }}>
                                    Create a free account</p>
                            </div>
                            <form noValidate onSubmit={this.onSubmit} className='text-center row col-md-12'>
                                <div className="col-md-6">
                                    <TextFieldGroup placeholder="First Name" error={errors.spreadSheetLink}
                                                    type="text" onChange={this.changeHandler} value={this.state.spreadSheetLink}
                                                    name="spreadSheetLink"
                                    />
                                </div>
                                <div className="col-md-12 d-flex justify-content-center text-center">
                                    <input style={{maxWidth:'400px',background:'#008cff'}}
                                           type="submit" className="btn btn-info btn-block mt-4" value='Send'/>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    sendLink: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(mapStateToProps, { sendLink })(withRouter(Home))