import axios from 'axios';
import React, { Component } from 'react';
import { Table, Navbar, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class FileUploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      User: '',
      userImage: '',
      files: [],
    };

    this.handleAll1 = this.handleAll1.bind(this);
    this.upload = this.upload.bind(this);
  }

  handleAll1 = (event) => {
    console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount = () => {
    const Token = localStorage.getItem('token');
    console.log(Token);

    axios({
      method: 'get',
      url: 'http://localhost:4000/user/userdetails',
      headers: { Authorization: 'Bearer ' + Token },
    })
      .then((result) => {
        console.log('Result', result);
        this.setState({ User: result.data.data });
        console.log('API USER', this.state.User);
      })
      .catch((err) => {
        console.log(err);
      });

    this.getFiles();
  };

  next = (event) => {
    try {
      console.log('Evet', event.target);
      let files = event.target.files; // image will come at this place
      let reader = new FileReader(); // Reader will read the image
      reader.readAsDataURL(files[0]); // now it is converting the image into base-64
      reader.onload = (e) => {
        console.log(event.target.files[0].name);
        // when it gets any event on loading, it shows the result, and set it in a state.
        //console.log(e.target.result);
        this.setState({
          userImage: e.target.result,
          fileName: event.target.files[0].name,
        });
      };
    } catch (e) {
      console.log('error', e);
    }
  };
  upload = (event) => {
    try {
      const Token = localStorage.getItem('token');
      let data = {
        image: this.state.userImage,
        fileName: this.state.fileName,
      };

      axios({
        method: 'post',
        url: 'http://localhost:4000/user/file/upload',
        headers: { Authorization: 'Bearer ' + Token },
        data: data,
      }).then((result) => {
        console.log('UPLOAD FILE ', result);
        this.setState({ userImage: '' });
        this.state.files.push(result.data.data);
        this.setState({ files: this.state.files });
        //   this.setState({ files: result.data.data });
          
        console.log('Files Array', this.state.files);
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  getFiles = () => {
    try {
      const Token = localStorage.getItem('token');

      axios({
        method: 'get',
        url: 'http://localhost:4000/user/file/list',
        headers: { Authorization: 'Bearer ' + Token },
      }).then((result) => {
        //   console.log('User uploaded files ', result);
        this.setState({ files: result.data.data });
        console.log(this.state.files);
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  deleteFiles = (item, index) => {
    try {
      const Token = localStorage.getItem('token');
      console.log(item);
      axios({
        method: 'delete',
        url: 'http://localhost:4000/user/file/deletefile',
        headers: { Authorization: 'Bearer ' + Token },
        data: { id: item._id },
      }).then((result) => {
        console.log('Deleted file ', result);

        let Temp = item;
        var result1 = this.state.files.filter((i) => i != Temp);
        // console.log("RESULT", result1.length);
        this.setState({
          files: result1,
        });

        console.log(this.state.files);
      });
    } catch (e) {
      console.log('error', e);
    }
  };
  downloadFile = (url) => {
    //console.log('downloadFile', url);
    //const blobUrl = window.URL.createObjectURL(url);
    // console.log('blob', blobUrl);
    //const url1 = window.URL.createObjectURL(new Blob([url]));
    //console.log('blob', url1);
  };
  render() {
    return (
      <>
        <div className="container">
          <div className="form-box">
            <h4>{this.state.User.name}</h4>

            <Row>
              <input
                type="file"
                name="file"
                value={this.state.file}
                onChange={this.next}
                placeholder="Username"
              />
              <button
                className="btn btn-dark "
                onClick={() => {
                  this.upload();
                }}
                type="button"
              >
                Upload
              </button>
            </Row>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>secret code</th>
                  <th>file link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.files.length > 0 ? (
                  <>
                    {this.state.files.map((item, index) => {
                      return (
                        <>
                          {console.log('index', index)}
                          <tr>
                            <td>{index}</td>
                            <td>{item.fileName.slice(0, 10)}..</td>
                            <td>{item.secretCode}</td>
                            <td>
                              {/* <Link to={item.image} target="_blank">
                                <button>View</button>
                              </Link> */}
                              <a href={item.image} target="_blank" download>
                                <button>
                                  View
                                </button>
                              </a>
                            </td>
                            <td>
                              <button
                                className="btn btn-dark "
                                onClick={() => this.deleteFiles(item, index)}
                                type="submit"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </>
                ) : (
                  ''
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    );
  }
}

export default FileUploads;
