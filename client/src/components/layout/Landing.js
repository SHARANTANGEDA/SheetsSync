import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {connect} from 'react-redux'
import {loginGoogleUser, loginUser} from '../../actions/authActions'
import TextFieldGroup from "../common/TextFieldGroup";
import GoogleLogin from 'react-google-login';
import {convertGoogleToken} from "../../actions/googleAuthActions";



class Landing extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            modalIsOpen: false,
            errors: {}
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.errors);
        console.log(this.props.auth);
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
        if (nextProps) {
            this.setState({errors: nextProps.errors})
        }
    }





    onSubmit(e) {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        console.log({data:userData});
        this.props.loginUser(userData);
    }


    render() {
         const responseGoogleSuccess = response => {
    console.log(response);
            if (response.profileObj) {
              localStorage.setItem("google_avatar_url", response.profileObj.imageUrl);
              localStorage.setItem("google_name", response.profileObj.name);
              localStorage.setItem("email", response.profileObj.email);
            }
            this.props.convertGoogleToken(response.Zi.access_token);
          };
          const responseGoogleFailure = response => {
            console.log(response);
            alert('This error might occur if you are not logged in from your bits account, ' +
              'please recheck that you are logged in to bits account')
          };

        const {errors} = this.state;
        return (
            <div className="login landing " style={{maxHeight: '100%'}}>
                <div className="dark-overlay">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-light">
                            <div className="col-md-12 text-center">
                                <h1 className="display-3 mb-4" style={{color: 'white'}}>Department of CSIS</h1>
                                <p className="lead" style={{color: 'white'}}>
                                    {' '}
                                    Sign in to access account
                                </p>
                                <hr/>
                            </div>
                            <div className="col-md-6 text-center">

                                <form noValidate onSubmit={this.onSubmit}>
                                    <TextFieldGroup placeholder="Email Address" error={errors.email}
                                                    type="text" onChange={this.changeHandler} value={this.state.email}
                                                    name="email"
                                    />
                                    <TextFieldGroup placeholder="Password" error={errors.password}
                                                    type="password" onChange={this.changeHandler}
                                                    value={this.state.password} name="password"
                                    />
                                    <div className="col-md-12 d-flex justify-content-center text-center">
                                        <div className='col-md-6'>
                                            <input style={{maxWidth: '250px'}} value='Login' type="submit"
                                                   className="btn btn-info btn-block mt-4"/>
                                        </div>
                                    </div>
                                    <hr/>
                                </form>
                                <hr/>
                                <GoogleLogin
                                    clientId="373821760819-n464h5ipe9u121o98tqbd5973q4m1djg.apps.googleusercontent.com"
                                    buttonText="LOGIN WITH GOOGLE"
                                    onSuccess={responseGoogleSuccess}
                                    onFailure={responseGoogleFailure}
                                  />

                            </div>
                        </div>
                        {/*<button onClick={this.googleLogin}>Log In with Gmail</button>*/}
                        {/*<a href={`http://127.0.0.1:8000/accounts/google/login`}>Log In with Gmail</a>*/}

                    </div>
                </div>
            </div>
        );
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    loginGoogleUser: PropTypes.func.isRequired,
    convertGoogleToken: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {loginUser, loginGoogleUser, convertGoogleToken})(Landing);
