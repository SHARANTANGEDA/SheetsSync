import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth
		};
		this.onChange = this.onChange.bind(this);
		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this)
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


	render() {
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
				<div className="row col-md-4 d-flex justify-content-start align-items-center">
					<div style={{ background:'#8d0000', borderRadius:'50%' }}>
						<img style={{ maxWidth: '45px', maxHeight: '45px', padding:'10px', margin:'2px'}}
							 src={require('../../img/logo.png')} alt=""
						/>
					</div>

					<h3 style={{color: '#ffffff', marginLeft:'10px', fontWeight:'bold'}}>Sheet Sync</h3>

				</div>
				<div className="row col-md-8 d-flex justify-content-end align-items-center" style={{color: 'white'}}>
					<Link to='/home' className='btn btn-primary' style={{maxWidth: '250px',
						background: '#8d0000', marginRight:'10px',
						borderStyle: 'none',
						borderRadius: '5px', fontSize:'20px'}}>Explore Sheets</Link>
					<Link to='/' className='btn btn-primary' style={{maxWidth: '250px',
						background: '#8d0000',
						borderStyle: 'none',
						borderRadius: '5px', fontSize:'20px'}}>Add New Sheets</Link>
				</div>
			</div>
		);
		const { width } = this.state;
  	const isMobile = width <= 575;
  	if(isMobile) {
  		return (
  			<nav className="navbar navbar-expand-sm  col-md-12 w-100" style={{background: '#ffe36b'}}>
				<div className="row container-fluid d-flex justify-content-between col-md-12 w-100">
					{guestLinkO}
				</div>
			</nav>
  			)
		} else {
  		return (
			<nav className="navbar navbar-expand-sm  col-md-12 w-100" style={{background: '#b30000'}}>
				<div className="row container-fluid d-flex justify-content-between col-md-12 w-100">
					<div className='row  d-flex justify-content-between col-md-12 w-100'>
						{guestLinkO}
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
