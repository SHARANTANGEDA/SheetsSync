import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logoutUser} from '../../actions/authActions'

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


	render() {
		const {isAuthenticated, user} = this.props.auth;
		const {category, errors} = this.state;
		const authLinkO = (
			<div className='d-flex justify-content-between align-content-end col-md-12'>
				<div className="row col-md-6 d-flex justify-content-start align-items-center"
						 style={{color: 'white', verticalAlign: 'bottom'}}>
									</div>

				<div className="row col-md-4 d-flex justify-content-end align-items-center" style={{color: 'white'}}>
					<img style={{ maxWidth: '200px', maxHeight: '150px' }}
					     src={require('../../img/logo.png')} alt=""
					/>
					<h2 style={{color: '#ffffff'}}>Sheet Sync</h2>
				</div>
			</div>

		);
		const authLinkMobileO = (
			<div className='d-flex justify-content-between align-content-end col-md-12'>
				<div className="row col-md-6 d-flex justify-content-start align-items-center"
						 style={{color: 'white', verticalAlign: 'bottom'}}>
									</div>

				<div className="row col-md-4 d-flex justify-content-end align-items-center" style={{color: 'white'}}>
						<div style={{color:'white', marginLeft:'10px'}}>
							<i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"/></div>
				</div>
			</div>

		);
		const guestLinkO = (
			<div className='d-flex justify-content-between align-content-end col-md-12'>
				<div className="row col-md-8 d-flex justify-content-start align-items-center">
					<div style={{ background:'#8d0000', borderRadius:'50%' }}>
						<img style={{ maxWidth: '50px', maxHeight: '50px', padding:'10px', margin:'2px'}}
							 src={require('../../img/logo.png')} alt=""
						/>
					</div>

				</div>
				<div className="row col-md-4 d-flex justify-content-end align-items-center" style={{color: 'white'}}>

					<h3 style={{color: '#ffffff', fontFamily: 'roboto'}}>Sheet Sync</h3>
				</div>
			</div>
		);
		const guestLink1 = (
			<ul className="navbar-nav components d-flex justify-content-around" style={{height: '100%'}}>

			</ul>
		);

		let authLinksIII = null;
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
			<nav className="navbar navbar-expand-sm  col-md-12 w-100" style={{background: '#b30000'}}>
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
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(Navbar)
