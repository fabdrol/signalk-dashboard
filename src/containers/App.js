import React, {
  Component,
  PropTypes
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dashboard from '../components/App'

class AppContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <Dashboard />
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  const actions = {}
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
