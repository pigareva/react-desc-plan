import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { createEmployee, updateEmployee } from '../controller/employeesController';
import store from '../store';
import { employeeUpdated, employeeCreated } from '../actions';
import { OTHER } from '../consts';

export default class EditEmployee extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
    this.handlePhotoChange = this.handlePhotoChange.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleCustomDepartmentChange = this.handleCustomDepartmentChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.state = {
      employee: this.props.employee,
      modal: this.props.modal,
      departments: [],
      newDepartment: null,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleEnter);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEnter);
  }

  async onSubmit() {
    const data = this.state.employee;
    if (this.state.employee.department === OTHER && this.state.newDepartment) {
      data.department = this.state.newDepartment;
    }
    const res = this.props.employee.name ?
      await updateEmployee(data) :
      await createEmployee(data);

    res.json()
      .then(
        (response) => {
          if (this.props.employee.name) {
            store.dispatch(employeeUpdated({ employee: response }));
          } else {
            store.dispatch(employeeCreated({ employee: response }));
          }
          return response;
        },
        (error) => {
          // ToDo
          console.log('Can not edit the employee', error);
        },
      );
    this.toggle();
  }

  async handleEnter(e) {
    if (e.key === 'Enter') {
      await this.onSubmit();
    }
  }

  handleNameChange(e) {
    const {
      _id, delay, department, photo,
    } = this.state.employee;

    this.setState({
      employee: {
        _id,
        name: e.target.value,
        email: `${e.target.value.split(' ').splice(-1, 1)}@pigareva.cc`,
        department,
        photo,
        delay,
      },
    });
  }

  handleDelayChange(e) {
    const {
      _id, name, email, department, photo,
    } = this.state.employee;

    this.setState({
      employee: {
        _id,
        name,
        delay: e.target.value,
        email,
        department,
        photo,
      },
    });
  }

  handlePhotoChange(e) {
    const {
      _id, name, delay, email, department,
    } = this.state.employee;

    this.setState({
      employee: {
        _id,
        name,
        delay,
        email,
        department,
        photo: e.target.value,
      },
    });
  }

  handleDepartmentChange(e) {
    const {
      _id, name, email, photo, delay,
    } = this.state.employee;
    this.setState({
      employee: {
        _id,
        name,
        email,
        delay,
        department: e.target.value,
        photo,
      },
    });
  }

  handleCustomDepartmentChange(e) {
    const { departments } = this.state;
    departments.push(e.target.value);
    this.setState({ departments, newDepartment: e.target.value });
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    const { departments } = this.props;
    if (departments.indexOf(OTHER) === -1) {
      departments.push(OTHER);
    }
    const options = departments.map(department => <option key={department}>{department}</option>);
    return (
      <div className="modal-edit">
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.props.employee.name ? 'Edit' : 'Add'} en employee</ModalHeader>

          <ModalBody>
            <Form id="editForm">
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={this.state.employee.name}
                  onChange={this.handleNameChange}
                  name="name"
                />

                <Label>Delay</Label>
                <Input
                  type="number"
                  value={this.state.employee.delay}
                  onChange={this.handleDelayChange}
                  name="delay"
                  min="0"
                />

                <Label>Email</Label>
                <Input
                  type="text"
                  disabled
                  value={this.state.employee.email}
                />

                <Label>Photo URL</Label>
                <Input
                  type="url"
                  value={this.state.employee.photo}
                  onChange={this.handlePhotoChange}
                  name="photo"
                />

                <Label>Department</Label>
                <Input
                  type="select"
                  onChange={this.handleDepartmentChange}
                  value={this.state.employee.department}
                  name="department"
                >
                  {options}
                </Input>
                {this.state.employee.department === OTHER &&
                <Label>Enter new department name
                  <Input
                    type="text"
                    onChange={this.handleCustomDepartmentChange}
                    name="customdepartment"
                  />
                </Label>
                }
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.toggle}>Close</Button>
            <Button onClick={this.onSubmit}>Save changes</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

EditEmployee.propTypes = {
  employee: PropTypes.objectOf(PropTypes.any),
  modal: PropTypes.bool.isRequired,
  departments: PropTypes.arrayOf(PropTypes.string).isRequired,
};

EditEmployee.defaultProps = {
  employee: {
    _id: null,
    delay: 0,
    name: '',
    department: '',
    email: '@pigareva.cc',
    photo: '',
  },
};
