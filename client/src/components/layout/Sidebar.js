import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logoutUser} from '../../actions/authActions'

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth
		};
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
		this.setState({width: window.innerWidth});
	};

	onLogoutClick(e) {
		e.preventDefault();
		// this.props.logoutUser()
	}


	render() {
		const {isAuthenticated, user} = this.props.auth;
		let authLinksIII = null;

		const {width} = this.state;
		const isMobile = width <= 575;
		if (isMobile) {
			return (
			  <div className=''>
          <div className="nav-side-menu">
            {/*<div className="brand"><i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"/></div>*/}

            <div className="menu-list">
              {/*<div className="brand">{user.email}</div>*/}
              {isAuthenticated ? authLinksIII : null}
            </div>
          </div>
        </div>

			)
		} else {
			return null
		}

	}
}

Sidebar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});
export default connect(mapStateToProps, {logoutUser})(Sidebar)
