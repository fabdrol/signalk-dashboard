import React from 'react'
import moment from 'moment'
import { Col } from 'react-bootstrap'
import config from 'config'
const labels = config.labels[config.language]

class DepthWidget extends React.Component {
  render() {
    const depth = this.props.depth
    const age = moment.tz(depth.timestamp, 'UTC')
    const now = moment.tz('UTC')
    const stale = (now.diff(age, 'ms') >= 30000)
    const classNames = `widget${stale ? ' stale' : ''}`

    return (
      <Col xs={12} sm={6} lg={4} className="widget-container">
        <div className={classNames}>
          <div className="widget-contents">
            <h3 className="title">{ labels.depthTitle }</h3>
            <h1 className="value">{ depth.value.toFixed(2) } <span>{labels.meter}</span></h1>
          </div>
        </div>
      </Col>
    )
  }
}

export default DepthWidget
