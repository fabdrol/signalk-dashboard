import './_styles/app.styl'
import './_styles/navbar.styl'
import './_styles/widget.styl'

import React from 'react'
import { Row } from 'react-bootstrap'

import Position from '../containers/Position'
import Speed from '../containers/Speed'
import CourseOverGround from '../containers/CourseOverGround'
import Depth from '../containers/Depth'
import Navbar from '../containers/Navbar'

class AppComponent extends React.Component {
  render() {
    return (
      <section className="dashboard">
        <Navbar />
        <section className="container-fluid">
          <Row>
            <Position />
            <CourseOverGround />
            <Speed />
            <Depth />
          </Row>
        </section>
      </section>
    )
  }
}

export default AppComponent
