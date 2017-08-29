import React from 'react'
import moment from 'moment'
import { Col } from 'react-bootstrap'
import config from 'config'
import convert from '../convert'
const labels = config.labels[config.language]

class SpeedWidget extends React.Component {
  constructor (props) {
    super(props)
    this.state = { view: 'both' }
    this.toggleView = this.toggleViewHandler.bind(this)
  }

  toggleViewHandler () {
    const current = this.state.view

    if (current === 'both') {
      return this.setState({ view: 'sog' })
    }

    if (current === 'sog') {
      return this.setState({ view: 'stw' })
    }

    return this.setState({ view: 'both' })
  }

  renderContents () {
    const sog = this.props.sog
    const stw = this.props.stw

    if (this.state.view === 'sog') {
      return (
        <div className="widget-contents">
          <h3 className="title">{labels.speedTitle}</h3>
          <h1 className="value">
            { convert.speed(sog.value).toFixed(2) }
            <span>{labels.sog}</span>
          </h1>
        </div>
      )
    }

    if (this.state.view === 'stw') {
      return (
        <div className="widget-contents">
          <h3 className="title">{labels.speedTitle}</h3>
          <h1 className="value">
            { convert.speed(stw.value).toFixed(2) }
            <span>{labels.stw}</span>
          </h1>
        </div>
      )
    }

    return (
      <div className="widget-contents">
        <h3 className="title">{labels.speedTitle}</h3>
        <div className="combined-values">
          <h1 className="value-left">
            { convert.speed(sog.value).toFixed(2) }
            <span>{labels.sog}</span>
          </h1>
          <h1 className="value-right">
            { convert.speed(stw.value).toFixed(2) }
            <span>{labels.stw}</span>
          </h1>
        </div>
      </div>
    )
  }

  render() {
    const sog = this.props.sog
    const stw = this.props.stw
    const sogAge = moment.tz(sog.timestamp, 'UTC')
    const stwAge = moment.tz(stw.timestamp, 'UTC')
    const now = moment.tz('UTC')
    const sogStale = (now.diff(sogAge, 'ms') >= 30000)
    const stwStale = (now.diff(stwAge, 'ms') >= 30000)
    const classNames = `widget${(sogStale || stwStale) ? ' stale' : ''}`

    return (
      <Col xs={12} sm={6} lg={4} className="widget-container" onClick={this.toggleView}>
        <div className={classNames}>
          {this.renderContents()}
        </div>
      </Col>
    )
  }
}

export default SpeedWidget
