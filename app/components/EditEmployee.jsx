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
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      employee: this.props.employee,
      modal: this.props.modal,
    };
  }

  async onSubmit() {
    const res = this.props.employee.name ?
      await updateEmployee(this.state.employee) :
      await createEmployee(this.state.employee);

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

  handleNameChange(e) {
    const {
      _id, department, photo,
    } = this.state.employee;

    this.setState({
      employee: {
        _id,
        name: e.target.value,
        email: `${e.target.value.split(' ').splice(-1, 1)}@pigareva.cc`,
        department,
        photo,
      },
    });
  }

  handleDepartmentChange(e) {
    const {
      _id, name, email, photo,
    } = this.state.employee;
    this.setState({
      employee: {
        _id,
        name,
        email,
        department: e.target.value,
        photo,
      },
    });
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    const temp = this.props.departments;
    temp.push(OTHER);
    const options = temp.map(department => <option key={department} >{department}</option>);
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

                <Label>Email</Label>
                <Input
                  type="text"
                  disabled
                  value={this.state.employee.email}
                />

                <Label>Department</Label>
                <Input
                  type="select"
                  onChange={this.handleDepartmentChange}
                  value={this.state.employee.department}
                >
                  {options}
                </Input>
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
  employee: PropTypes.objectOf(PropTypes.string),
  modal: PropTypes.bool.isRequired,
  departments: PropTypes.arrayOf(PropTypes.string).isRequired,
};

EditEmployee.defaultProps = {
  employee: {
    _id: null,
    name: '',
    department: '',
    email: '@pigareva.cc',
    photo: '',
  },
};
