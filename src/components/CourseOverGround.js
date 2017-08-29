import React from 'react'
import moment from 'moment'
import { Col } from 'react-bootstrap'
import config from 'config'
import convert from '../convert'
const labels = config.labels[config.language]

class CourseOverGroundWidget extends React.Component {
  constructor (props) {
    super (props)
    this.state = { showTrue: true }
    this.toggleView = this.toggleViewHandler.bind(this)
  }

  toggleViewHandler () {
    this.setState({
      showTrue: !this.state.showTrue
    })
  }

  renderContents () {
    const cogTrue = this.props.cogTrue
    const cogMag = this.props.cogMag

    if (this.state.showTrue !== true) {
      return (
        <div className="widget-contents">
          <h3 className="title">{ labels.cogTitle }</h3>
          <h1 className="value">{ convert.angle(cogMag.value).toFixed(2) } <span>{ labels.cogMag }</span></h1>
        </div>
      )
    }

    return (
      <div className="widget-contents">
        <h3 className="title">{ labels.cogTitle }</h3>
        <h1 className="value">{ convert.angle(cogTrue.value).toFixed(2) } <span>{ labels.cogTrue }</span></h1>
      </div>
    )
  }

  render () {
    const cogTrue = this.props.cogTrue
    const cogMag = this.props.cogMag
    const cogTrueAge = moment.tz(cogTrue.timestamp, 'UTC')
    const cogMagAge = moment.tz(cogMag.timestamp, 'UTC')
    const now = moment.tz('UTC')
    const cogTrueStale = (now.diff(cogTrueAge, 'ms') >= 30000)
    const cogMagStale = (now.diff(cogMagAge, 'ms') >= 30000)
    const classNames = `widget${(cogTrueStale || cogMagStale) ? ' stale' : ''}`

    return (
      <Col xs={12} sm={6} lg={4} className="widget-container" onClick={this.toggleView}>
        <div className={classNames}>
          {this.renderContents()}
        </div>
      </Col>
    )
  }
}

export default CourseOverGroundWidget
