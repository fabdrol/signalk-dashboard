import React from 'react'
import config from 'config'
import moment from 'moment'

class NavbarComponent extends React.Component {
  render () {
    const utc = moment.tz('utc')
    const local = moment.tz('Europe/Amsterdam')

    return (
      <header className="header">
        <span className="header-utc">{ utc.format('HH:mm') } (UTC)</span>
        <span className="header-title">{ config.name }</span>
        <span className="header-time">{ local.format('HH:mm') }</span>
      </header>
    )
  }
}

export default NavbarComponent
