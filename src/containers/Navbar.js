import React, {
  Component,
  PropTypes
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavbarComponent from '../components/Navbar'

class NavbarContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <NavbarComponent time={this.props.time} />
  }
}

function mapStateToProps(state) {
  return {
    time: state.time
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarContainer)
