import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logoutUser} from '../../actions/authActions'
import GoogleLogoutButton from "./GoogleLogoutButton";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: {value: 'mr.No', label: 'MR No'},
			errors: {},
			search: '',
			width: window.innerWidth
		};
		this.onCatChange = this.onCatChange.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this)
	}

	onSubmit(e) {
		e.preventDefault();
		const newSearch = {
			category: this.state.category.value,
			search: this.state.search,
		};
		if (this.state.category.value === 'mr.No') {
			this.props.getSearchResults(newSearch)
		} else if (this.state.category.value === 'name') {
			window.location.href = `/nameSearchResults/${this.state.search}`
		}
	}

	openModal() {
		this.setState({modalIsOpen: true})
	}

	afterOpenModal() {

	}

	closeModal() {
		this.setState({modalIsOpen: false})
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value})
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors})
		}
	}

	componentWillMount() {
  window.addEventListener('resize', this.handleWindowSizeChange);
}

// make sure to remove the listener
// when the component is not mounted anymore
componentWillUnmount() {
  window.removeEventListener('resize', this.handleWindowSizeChange);
}

handleWindowSizeChange = () => {
  this.setState({ width: window.innerWidth });
};

	onCatChange(e) {
		this.setState({category: e})
	}

	onLogoutClick(e) {
		e.preventDefault();
		this.props.logoutUser()
	}


	render() {
		const {isAuthenticated, user} = this.props.auth;
		const {category, errors} = this.state;
		const authLinkO = (
			<div className='d-flex justify-content-between align-content-end col-md-12'>
				<div className="row col-md-6 d-flex justify-content-start align-items-center"
						 style={{color: 'white', verticalAlign: 'bottom'}}>
									</div>

				<div className="row col-md-4 d-flex justify-content-end align-items-center" style={{color: 'white'}}>
					{/*<img style={{ maxWidth: '200px', maxHeight: '150px' }}*/}
					{/*     src={require('../../img/invertedEye.png')} alt=""*/}
					{/*/>*/}
					<h3 style={{color:'#06ff00'}}>L</h3><h3 style={{color:'#00c8ff'}}>O</h3><h3 style={{color:'#06ff00'}}>R</h3>
					     <h3 style={{color:'#06ff00'}}>{' '}T</h3><h3 style={{color:'#00f500'}}>r</h3><h3 style={{color:'#00c8ff'}}>a</h3>
					     <h3 style={{color:'#06ff00'}}>c</h3><h3 style={{color:'#00c8ff'}}>k</h3><h3 style={{color:'#06ff00'}}>e</h3>
					       <h3 style={{color:'#00c8ff'}}>r</h3>
					{/*<img style={{maxWidth: '100px', maxHeight: '100px'}}*/}
					{/*		 src={require('../../img/insert-picture-icon.png')} alt=""*/}
					{/*/>*/}
					{/*<h2 style={{color: '#000d69', fontWeight: 'bold', fontFamily: 'Times New Roman'}}>Lor Tracker</h2>*/}

				</div>
			</div>

		);
		const authLinkMobileO = (
			<div className='d-flex justify-content-between align-content-end col-md-12'>
				<div className="row col-md-6 d-flex justify-content-start align-items-center"
						 style={{color: 'white', verticalAlign: 'bottom'}}>
									</div>

				<div className="row col-md-4 d-flex justify-content-end align-items-center" style={{color: 'white'}}>
						<GoogleLogoutButton/>
						<div style={{color:'white', marginLeft:'10px'}}><i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"/></div>
				</div>
			</div>

		);
		const guestLinkO = (
			<div className='d-flex justify-content-between align-content-end col-md-12'>
				<div className="row col-md-8 d-flex justify-content-start align-items-center"
						 style={{color: 'white', verticalAlign: 'bottom'}}>
									</div>
				<div className="row col-md-4 d-flex justify-content-end align-items-center" style={{color: 'white'}}>

					<h2 style={{color: '#000d69'}}>Lor Tracker</h2>
				</div>
			</div>
		);
		const guestLink1 = (
			<ul className="navbar-nav components d-flex justify-content-around" style={{height: '100%'}}>

			</ul>
		);

		let authLinksIII = null;
		if (isAuthenticated && (user.role === 'hod')) {
			authLinksIII = (
				<ul className="navbar-nav components d-flex justify-content-around" style={{height: '100%'}}>
					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/dashboard" style={{borderRadius: '5px'}}>
							Home
						</Link>
					</li>

					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
					</li>
					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>

					</li>
					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px', minWidth:'200px'
					}}>
						<Link className="nav-link nav-item d-flex justify-content-between" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
							Lor Requests Control<i className="fas fa-caret-down"/>
						</Link>
						<ul className="dropdown-menu " style={{ background: '#ffe36b'}}>
						<li  >
						<Link className='nav-link' to='/viewAllNewRequests'>
							New Requests
						</Link>
						</li>
							<li>
						<Link className='nav-link' to='/viewAllAcceptedRequests' >
							Accepted Requests
						</Link></li>
							<li>
						<Link className='nav-link' to='/viewAllCompletedRequests' >
							Completed Requests
						</Link></li>
							<li>
						<Link className='nav-link' to='/viewAllRequests' >
							View All Requests
						</Link></li>
						</ul>
					</li>
					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px', minWidth:'200px'
					}}>
						<Link className="nav-link nav-item d-flex justify-content-around" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
							User Control<i className="fas fa-caret-down"/>
						</Link>
						<ul className="dropdown-menu " style={{ background: '#ffe36b', width:'100%'}}>
							<li>
						<Link className='nav-link' to="/viewAllStudents" >
							View Students
						</Link></li>
							<li>
						<Link className='nav-link' to="/viewCurrentActiveUsers" >
							View Active Users
						</Link></li>
						</ul>
					</li>
					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
													{/*<img src={localStorage.getItem('google_avatar_url')} alt='' style={{maxWidth:'50px', maxHeight:'50px',borderRadius:'50%' }}/>*/}

						<Link className="nav-link nav-item d-flex justify-content-around" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
							{user.email}
						</Link>
					</li>
					<li className="nav-item pull-right" style={{borderRadius: '5px'}}>
						<GoogleLogoutButton/>
					</li>
				</ul>
			)
		} else if (isAuthenticated && user.role === 'faculty') {
			authLinksIII = (
				<ul className="navbar-nav components d-flex justify-content-around" style={{height: '100%'}}>
					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/dashboard" style={{borderRadius: '5px'}}>
							Home
						</Link>
					</li>

					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
					</li>
					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>

					</li>
					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px', minWidth:'200px'
					}}>
						<Link className="nav-link nav-item d-flex justify-content-between" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
							Lor Requests Control<i className="fas fa-caret-down"/>
						</Link>
						<ul className="dropdown-menu " style={{ background: '#ffe36b'}}>
							<li  >
						<Link className='nav-link' to="/viewNewRequests">
							New Requests
						</Link>
					</li>
							<li>
						<Link className='nav-link' to="/viewAcceptedLorRequests" >
							Accepted Requests
						</Link></li>
							<li>
						<Link className='nav-link' to="/completedLorRequests" >
							Completed Requests
						</Link></li>
						</ul>
					</li>
					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						{/*<img src={localStorage.getItem('google_avatar_url')} alt='' style={{maxWidth:'50px', maxHeight:'50px',borderRadius:'50%' }}/>*/}

						<Link className="nav-link nav-item d-flex justify-content-around" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
						</Link>
					</li>
					<li className="nav-item pull-right" style={{borderRadius: '5px'}}>
						<GoogleLogoutButton/>
					</li>
				</ul>
			)
		} else if (isAuthenticated && user.role === 'student') {
			authLinksIII = (
				<ul className="navbar-nav components d-flex justify-content-around" style={{height: '100%'}}>
					<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/dashboard" style={{borderRadius: '5px'}}>
							Home
						</Link>
					</li>
					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
					<Link className="nav-link nav-item d-flex justify-content-between" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
							LOR{' '}<i className="fas fa-caret-down"/>
						</Link>
						<ul className="dropdown-menu ">
							<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/viewAppliedLor" style={{borderRadius: '5px'}}>
							View Application Status
						</Link>
					</li>
							<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/submitLor" style={{borderRadius: '5px'}}>
							Submit Lor
						</Link>
					</li>
							<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/viewMyLor" style={{borderRadius: '5px'}}>
							View My Lor
						</Link>
					</li>
							<li className='nav-item' style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className='nav-link' to="/fillLor" style={{borderRadius: '5px'}}>
							Create Lor
						</Link>
					</li>
						</ul>
					</li>

					<li className="nav-item dropdown " style={{
						color: 'white', background: '#ffe36b', borderRadius: '5px'
					}}>
						<Link className="nav-link nav-item d-flex justify-content-around" to="" data-toggle="dropdown"
									style={{borderRadius: '5px'}}>
							{/*<img src={localStorage.getItem('google_avatar_url')} alt='' style={{maxWidth:'50px', maxHeight:'50px',borderRadius:'50%' }}/>*/}
							{user.email}<i className="fas fa-caret-down"/>
						</Link>
						<ul className="dropdown-menu " style={{width: '100%'}}>
							{/*<li><Link className='nav-link' to="/changePassword">*/}
							{/*	Change Password</Link></li>*/}
							<li><Link className='nav-link' to="/editProfile">
								My Profile</Link></li>
						</ul>
					</li>
					<li className="nav-item pull-right" style={{borderRadius: '5px'}}>
						<GoogleLogoutButton/>
					</li>
				</ul>
			)
		}
		const { width } = this.state;
  	const isMobile = width <= 575;
  	if(isMobile) {
  		return (
					<nav className="navbar navbar-expand-sm  col-md-12 w-100" style={{background: '#ffe36b'}}>
						{/*<div style={{color:'white'}}><i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"/></div>*/}
				<div className="row container-fluid d-flex justify-content-between col-md-12 w-100">
					{isAuthenticated ? authLinkMobileO : guestLinkO}
				</div>
			</nav>
  			)
		} else {
  		return (
			<nav className="navbar navbar-expand-sm  col-md-12 w-100" style={{background: '#ffe36b'}}>
				<div className="row container-fluid d-flex justify-content-between col-md-12 w-100">
					<div className='row  d-flex justify-content-between col-md-12 w-100'>
						{isAuthenticated ? authLinkO : guestLinkO}
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#mobile-nav"
						>
							<span className="navbar-toggler-icon" style={{background:'white'}}/>
						</button>
						<div className="row collapse navbar-collapse justify-content-end w-100" id="mobile-nav">
							{isAuthenticated ? authLinksIII : guestLink1}
						</div>
					</div>
				</div>
			</nav>
		)
		}

	}
}

Navbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	search: state.search
});
//ffec96
export default connect(mapStateToProps, {logoutUser})(Navbar)
