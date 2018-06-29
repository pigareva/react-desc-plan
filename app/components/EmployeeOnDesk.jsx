import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardSubtitle, Button, ButtonGroup, Badge } from 'reactstrap';
import { TrashcanIcon, PencilIcon } from 'react-octicons';
import DeskClock from './DeskClock';
import { DEFAULT_BACKGROUND, WORKING_DAY_LONG } from '../consts';
import EditEmployeeWithDepartments from '../containers/EditEmpployeeWithDepartments';
import { deleteEmployee } from '../controller/employeesController';
import store from '../store';
import { employeeDeleted } from '../actions';

export default class EmployeeOnDesk extends Component {
  constructor(props) {
    super(props);
    this.goHome = this.goHome.bind(this);
    this.comeToOffice = this.comeToOffice.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.toggleEmployeeOnDesk = this.toggleEmployeeOnDesk.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.editEmployee = this.editEmployee.bind(this);
    this.state = {
      atWork: false,
      timerIsOff: false,
      employee: this.props.employee,
      showEdit: false,
    };
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

  goHome() {
    this.setState({ atWork: false, timerIsOff: true });
  }

  comeToOffice() {
    this.setState({ atWork: true, timerIsOff: false });
  }

  startTimer() {
    this.setState({ timerIsOff: false });
  }

  toggleEmployeeOnDesk() {
    if (this.state.atWork) {
      this.goHome();
    } else {
      this.comeToOffice();
    }
  }

  async deleteEmployee() {
    const id = this.state.employee._id;
    const res = await deleteEmployee(id);

    res.json()
      .then(
        () => {
          store.dispatch(employeeDeleted({ id: this.state.employee._id }));
        },
        (error) => {
          // ToDo
          console.log('Can not delete the employee', error);
        },
      );
  }

  toggleEditModal() {
    this.setState({ showEdit: !this.state.showEdit });
  }

  editEmployee(employee) {
    this.setState({ employee });
    this.toggleEditModal();
  }

  render() {
    const deskStyle = this.state.atWork ? 'desk-flex-block desk-at-work' : 'desk-flex-block';
    const backgroundImage = this.state.employee.photo ? `url(${this.state.employee.photo})` : `url(${DEFAULT_BACKGROUND})`;
    return (
      <Card
        className={deskStyle}
        style={this.state.atWork ? { backgroundImage } : null}
      >
        <CardBody>
          <CardTitle><a href={`mailto:${this.email}`}>{this.name}</a></CardTitle>
          <CardSubtitle>{this.department}</CardSubtitle>
        </CardBody>

        <ButtonGroup>
          <Badge className="clock-button">
            <DeskClock
              endTime={WORKING_DAY_LONG}
              isOff={this.state.timerIsOff}
              startTimeCallback={this.comeToOffice}
              endTimeCallback={this.goHome}
              delay={this.state.employee.delay}
              restartTime={this.props.restartTime}
              startTimer={this.startTimer}
            />
          </Badge>
          <Button onClick={this.toggleEmployeeOnDesk}>
            {this.state.atWork ? 'I am working' : 'I am relaxing'}
          </Button>
          <Button onClick={this.deleteEmployee} className="delete">
            <TrashcanIcon />
          </Button>
          <Button onClick={this.toggleEditModal}>
            <PencilIcon />
          </Button>
        </ButtonGroup>

        {this.state.showEdit && this.props.restartTime &&
          <EditEmployeeWithDepartments
            employee={this.state.employee}
            editCallback={this.editEmployee}
            modal={this.state.showEdit}
          />}

      </Card>
    );
  }
}

EmployeeOnDesk.propTypes = {
  employee: PropTypes.objectOf(PropTypes.string).isRequired,
  restartTime: PropTypes.bool,
};

EmployeeOnDesk.defaultProps = {
  restartTime: false,
};
