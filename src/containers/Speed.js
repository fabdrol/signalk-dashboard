import React, {
  Component,
  PropTypes
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SpeedWidget from '../components/Speed'

class WidgetContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <SpeedWidget sog={this.props.navigation.sog} stw={this.props.navigation.stw} />
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetContainer)
