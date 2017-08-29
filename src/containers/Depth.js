import React, {
  Component,
  PropTypes
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DepthWidget from '../components/Depth'

class WidgetContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <DepthWidget depth={this.props.environment.depth} />
  }
}

function mapStateToProps(state) {
  return {
    environment: state.environment
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WidgetContainer)
