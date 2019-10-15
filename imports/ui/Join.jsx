import React, { Component } from 'react';
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

class Login extends Component {
  constructor(props) {
    super(props);
    this.valueIdGame = "";
    this.state={error:false, errorMsg:""};
  }

  joinGame() {
    Meteor.call("joinPartida", this.valueIdGame, this.props.user.username, (err, result)=>{
      if(err){alert(err);}

    });
    this.props.joinGameNow(this.valueIdGame);

  }

  onChangeIdGame(e) {
    this.valueIdGame = e.target.value;
  }


  render() {
    if(this.state.error){
      return (
        <div>
          <div>
            No existe una partida con el link dado o el juego está lleno!
          </div>
          <form>
            Id del juego: <input className="form-control" onChange={this.onChangeIdGame.bind(this)} type="text" />
          </form>
          <button className="btn btn-dark comenzar" onClick={this.joinGame.bind(this)}>Unirte a juego</button>
        </div>
      );
    }
    else{
      return (
        <div>
          <form>
            Id del juego: <input className="form-control" onChange={this.onChangeIdGame.bind(this)} type="text" />
          </form>
          <button className="btn btn-dark comenzar" onClick={this.joinGame.bind(this)}>Unirte a juego</button>
        </div>
      );
    }
  }
}

export default AppWrapper = withTracker(() => {
  return {
    user: Meteor.user()
  };
})(Login);
