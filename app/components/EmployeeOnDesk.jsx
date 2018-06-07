import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button, ButtonGroup } from 'reactstrap';
import Clock from './Clock';
import PropTypes from 'prop-types';
import { URL_DELETE_EMPLOYEE } from '../consts';

export default class EmployeeOnDesk extends Component {
  constructor(props) {
    super(props);
    this.goHome = this.goHome.bind(this);
    this.comeToOffice = this.comeToOffice.bind(this);
    this.toggleEmployeeOnDesk = this.toggleEmployeeOnDesk.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
    this.state = {
      atWork: true, timeAtWork: 0, timerIsOff: false, employee: this.props.employee,
    };
  }

  componentDidMount() {
    this.comeToOffice();
  }

  goHome() {
    this.setState({ atWork: false, timerIsOff: true });
  }

  comeToOffice() {
    this.setState({ atWork: true, timerIsOff: false });
  }

  toggleEmployeeOnDesk() {
    if (this.state.atWork) {
      this.goHome();
    } else {
      this.comeToOffice();
    }
  }

  deleteEmployee() {
    // ToDo check if rendered
    const id = this.state.employee._id;
    const url = `${URL_DELETE_EMPLOYEE}${id}`;

    fetch(url)
      .then(res => {
        console.log('res', res);
        res.json();
      })
      .then(
        () => {
          this.setState({
            employee: {
              name: 'I am not there any more',
              department: '',
              email: '',
              photo: '',
            },
            atWork: false,
          });
        },
        (error) => {
          // ToDo
        },
      );
  }


  editEmployee() {
    // ToDo check if rendered
    const id = this.state.employee.id;
    const employee = { name: 'New' };
    this.setState({ employee });
  }

  get email() {
    return this.state.employee.email;
  }

  get name() {
    return this.state.employee.name;
  }

  get department() {
    return this.state.employee.department;
  }

  render() {
    const descStyle = this.state.atWork ? 'desk-flex-block desk-at-work' : 'desk-flex-block';

    return (
      <Card className={descStyle}>
        <CardBody>
          <CardTitle><a href={`mailto:${this.email}`}>{this.name}</a></CardTitle>
          <CardSubtitle>{this.department}</CardSubtitle>
        </CardBody>
        <Button onClick={this.toggleEmployeeOnDesk}>
          {this.state.atWork ? 'I am working' : 'I am relaxing'}
        </Button>
        <ButtonGroup>
          <Button onClick={this.deleteEmployee}>
            <span className="glyphicon glyphicon-trash" aria-hidden="true" />
          </Button>
          <Button onClick={this.editEmployee}>
            <span className="glyphicon glyphicon-edit" aria-hidden="true" />
          </Button>
        </ButtonGroup>

        <Clock time={0} isOff={this.state.timerIsOff} />
      </Card>
    );
  }
}

EmployeeOnDesk.propTypes = {
  employee: PropTypes.object.isRequired,
};
