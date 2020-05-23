import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


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


class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			uploadModal: false,
			errors: {},
			currentlyActiveRequest: null,
			rejectionModal: false,
			width: window.innerWidth
		};
		this.changeHandler = this.changeHandler.bind(this);

	}

	componentDidMount() {
		if (this.props.auth.user.role === 'student') {
			this.props.studentHome(this.props.match.params.id)
		}
	}

	changeHandler(e) {
		this.setState({[e.target.name]: e.target.value})
	}


	componentWillMount() {
		window.addEventListener('resize', this.handleWindowSizeChange);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleWindowSizeChange);
	}

	handleWindowSizeChange = () => {
		this.setState({width: window.innerWidth});
	};


	render() {
		let userRole = this.props.auth.user.role;
		let {errors} = this.state;
			return (
				<div className="display ">
					<div className="App-content row d-flex justify-content-center">
						<button
							className="rounded border d-flex justify-content-center align-items-center  pl-1 w-50 my-3"
							style={{
								boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), ' +
									'0 6px 20px 0 rgba(0, 0, 0, 0.19)',
								fontSize: '25px', background: '#000d69', color: 'white'
							}}>Welcome {this.props.auth.user.first_name}
						</button>
					</div>
					<div className='col-md-12 '
							 style={{background: '#c9c9c9', padding: '10px', borderRadius: '10px', margin: '5px'}}>
						<h5 className='row text-center fl1 fs-headline1' style={{margin: '5px', padding: '5px'}}>
							Guidelines before applying for Letter of Recommendation:</h5>
						<ul style={{listStyleType:'square', lineHeight: '50px', fontSize: '12pt', fontWeight:'bold'}}>
							<li>This site allows you to apply for Letter of Recommendation under multiple faculty</li>
							<li>This site currently allows you to apply for LOR under Computer Science faculty only</li>
							<li>It is advised to take word of consent from the faculty before applying for LOR Here</li>
							<li>When you apply for Lor here, it is not guaranteed that you will get one, it is entirely upto
								individual faculty</li>
							<li>This site is not managed by AUGSD, any queries should be dealt with Computer Science & Information Systems Department</li>
							<li style={{fontStyle:'italic', color:'red'}}>Important: It is strongly recommended that you have done atleast one of course or
								project or thesis under the concerned faculty,
								if not then you have to enter the reason for Lor in others section in detail</li>
						</ul>
					</div>
				</div>
			)
		}

}


Dashboard.propTypes = {
	home: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,

};
const mapStateToProps = state => ({
	home: state.home,
	auth: state.auth,
});
export default connect(mapStateToProps, )(Dashboard)
