import React, {
  Component,
  PropTypes
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CourseOverGroundWidget from '../components/CourseOverGround'

class WidgetContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <CourseOverGroundWidget cogTrue={this.props.navigation.cogTrue} cogMag={this.props.navigation.cogMag} />
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
