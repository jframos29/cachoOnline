import React, { Component } from 'react';
import { Meteor } from "meteor/meteor";

class Login extends Component {
  constructor(props) {
    super(props);
    this.valueUser = "";
    this.valuePass = "";
    this.state={error:false};
  }

  logIn() {
    Meteor.loginWithPassword(this.valueUser, this.valuePass, (err) => {
      if(err){
        this.setState({error:true});
      }
      else{
        this.props.home();
      }
    });
  }

  onChangeUser(e) {
    this.valueUser = e.target.value;
  }

  onChangePass(e) {
    this.valuePass = e.target.value;
  }

  render() {
    if (this.state.error) {
      return (
        <div>

          <form>
            Usuario: <input className="form-control" onChange={this.onChangeUser.bind(this)} type="text" />
            Contraseña: <input className="form-control" onChange={this.onChangePass.bind(this)} type="password" />
          </form>
          <div className="text-danger comenzar">
            Has introducido usuario o contraseña incorrectos
          </div>
          <button className="btn btn-dark comenzar" onClick={this.logIn.bind(this)}>Inicia sesión</button>
        </div>
      );
    }
    return (
      <div>
        <form>
          Usuario: <input className="form-control" onChange={this.onChangeUser.bind(this)} type="text" />
          Contraseña: <input className="form-control" onChange={this.onChangePass.bind(this)} type="password" />
        </form>
        <button className="btn btn-dark comenzar" onClick={this.logIn.bind(this)}>Inicia sesión</button>
      </div>
    );
  }
}

export default Login;
