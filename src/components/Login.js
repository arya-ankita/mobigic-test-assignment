import React, { Component } from 'react';
import axios from 'axios';

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      nameError: '',
      passwordError: '',
    };

    this.handleAll1 = this.handleAll1.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleAll1 = (event) => {
    console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

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
        password: this.state.password,
      };
      console.log('login data', data);
      axios({
        method: 'post',
        url: 'http://localhost:4000/user/login',
        data: data,
      }).then((result) => {
          console.log('result', result);
          const token = result.data.token;
          console.log(token);
          localStorage.setItem('token', token);
        // Navigate to the Location.reload article by replacing this page
         window.location.replace('http://localhost:3000/files');
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
              <h4>Login</h4>
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
                <input
                  type="text"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleAll1}
                  className="outline"
                  placeholder="Username"
                />

                <button className="btn btn-dark " type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default login;