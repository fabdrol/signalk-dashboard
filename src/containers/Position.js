import React, {
  Component,
  PropTypes
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PositionWidget from '../components/Position'

class WidgetContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <PositionWidget position={this.props.navigation.position} />
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.navigation
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetContainer)
