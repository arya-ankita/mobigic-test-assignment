import React, { Component } from 'react';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    };

      this.handleAll1 = this.handleAll1.bind(this);
       this.submit = this.submit.bind(this);
  }

    handleAll1 = (event) => {
        console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

 

  valid() {
    if (this.state.name === '') {
      this.setState({ nameError: 'Name is Empty' });
    }
   
    if (!this.state.email.includes('@')) {
      this.setState({ emailError: 'Email is empty' });
    }
    if (this.state.password === '') {
      this.setState({ passwordError: 'Please enter password' });
    }
    if (this.state.confirmPassword === '') {
      this.setState({ confirmPasswordError: 'Please enter confirm password' });
    }
  }

  submit = (e) => {
    e.preventDefault();
    // let id = localStorage.getItem('userId');

    // this.valid();
    //   if (
    //       this.state.name !== '' &&
    //       this.state.email !== '' &&
    //       this.state.password !== '' &&
    //       this.state.confirmPassword !== ''
    //   ) {
          try {
              let data = {
                  name: this.state.name,
                  email: this.state.email,
                  password: this.state.password,
                  confirmPassword: this.state.confirmPassword,
              };
              console.log('pahla data', data);
              axios({
                  method: 'post',
                  url: 'http://localhost:4000/user/signup',
                  data: data,
              }).then((result) => {
                console.log('result', result);
                // Navigate to the Location.reload article by replacing this page
                window.location.replace('http://localhost:3000/login');
              });
          } catch (error) {
              console.log(error);
          }
    //   }
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="form-box">
            <div className="header-form">
              <h4>SignUp</h4>
            </div>
            <div className="body-form">
              <form onSubmit={this.submit}>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleAll1}
                  className="outline"
                  placeholder="Username"
                />
                <div className="error">{this.state.nameError}</div>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleAll1}
                  className="outline"
                  placeholder="Email"
                />
                <div className="error">{this.state.emailError}</div>
                <input
                  type="text"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleAll1}
                  className="outline"
                  placeholder="Password"
                />
                <div className="error">{this.state.passwordError}</div>
                <input
                  type="text"
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.handleAll1}
                  className="outline"
                  placeholder="Confirm Password"
                />
                <div className="error">{this.state.confirmPasswordError}</div>
                <button className="btn btn-dark " type="submit">
                  SignUp
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Signup;
