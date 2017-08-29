import React from 'react'
import moment from 'moment'
import { Col } from 'react-bootstrap'
import config from 'config'
import convert from '../convert'
const labels = config.labels[config.language]

class PositionWidget extends React.Component {
  constructor (props) {
    super(props)
    this.state = { view: 'DMS' }
    this.toggleView = this.toggleViewHandler.bind(this)
  }

  toggleViewHandler () {
    if (this.state.view === 'DMS') {
      return this.setState({ view: 'DD' })
    }

    return this.setState({ view: 'DMS' })
  }

  renderContents () {
    const position = this.props.position

    if (this.state.view === 'DD') {
      return (
        <div className="widget-contents">
          <h3 className="title">{ labels.positionTitle }</h3>
          <h2 className="value">{ position.longitude.toFixed(5) }</h2>
          <h2 className="value">{ position.latitude.toFixed(5) }</h2>
        </div>
      )
    }

    return (
      <div className="widget-contents">
        <h3 className="title">{ labels.positionTitle }</h3>
        <h2 className="value">{ convert.longitude(position.longitude) }</h2>
        <h2 className="value">{ convert.latitude(position.latitude) }</h2>
      </div>
    )
  }

  render() {
    const position = this.props.position
    const age = moment.tz(position.timestamp, 'UTC')
    const now = moment.tz('UTC')
    const stale = (now.diff(age, 'ms') >= 30000)
    const classNames = `widget${stale ? ' stale' : ''}`

    return (
      <Col xs={12} sm={6} lg={4} className="widget-container" onClick={this.toggleView}>
        <div className={classNames}>
          {this.renderContents()}
        </div>
      </Col>
    )
  }
}

export default PositionWidget
