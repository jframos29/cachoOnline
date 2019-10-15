import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import Leaderboard from "./LeaderBoard";
class SignedIn extends React.Component {

  constructor(props) {
    super(props);
  }

  crearJuego(){
    let a= this.props.joinGameNow;
    Meteor.call("createPartida", this.props.user.username, function(error, result) {
      if(error){
        throw error;
      }
      a(result);
    });
  }


  render() {
    return (
      <div>
        {this.props.user
          ?
        <div>
          <div id="containerSignedIn">
            <div className="row">
              <div className="col-4">
                <button className="btn btn-danger" onClick={this.props.historial}>Histórico</button>
                <button className="btn btn-dark" onClick={this.crearJuego.bind(this)}>Nuevo Juego</button>
                <button className="btn btn-dark" onClick={this.props.joinGame}>Únete a un juego</button>
                <Leaderboard></Leaderboard>
              </div>
              <div className="col-8">
                <div className="d-flex justify-content-center" >
                  <h5>Reglas del juego</h5>	
                </div>
                  <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                      <div className="d-flex justify-content-center" >
                      <ul>
                        <li>Debes apostar qué cantidad de dados de una pinta espcífica crees que hay entre todos los jugadores. <br/> 
                        En los dados la correspondencia es la siguiente:
                          <ol>
                            <li>As</li>
                            <li>Pato</li>
                            <li>Tren</li>
                            <li>Perro</li>
                            <li>Quina</li>
                            <li>Cena</li>
                          </ol>
                          </li>
                        <li>Cuando sea tu turno de jugar, si no eres el primero de la ronda te llegará
                          una apuesta, la cual podrás <strong>dudar</strong> si crees que no hay esa 
                          cantidad de dados, o podrás <strong>subir la apuesta</strong>.
                          <br/>
                          Cuando dudas una apuesta alguno de los jugadores perderá dado.
                          <ul>
                            <li>Si dudaste una apuesta que era cierta, <strong>pierdes dado</strong>.</li>
                            <li>Si dudaste una apuesta que en efecto era falsa, el que hizo dicha apuesta <strong>pierde dado</strong>.</li>
                          </ul>
                        </li>
                        <li>Para subir la apuesta, hay varias consideraciones a tener en cuenta:
                          <ul>
                            <li>Si la anterior apuesta <strong>no es un as</strong> puedes:
                              <ol>
                                <li>Subir la cantidad de dados de la misma pinta.
                                  <br/>
                                  Ejemplo: <i>Última apuesta: 4 tren</i> --> Mi apuesta: 5 tren
                                </li>
                                <li>Mantener la cantidad pero con una pinta mayor.
                                  <br/>
                                  Ejemplo: <i>Última apuesta: 4 tren</i> --> Mi apuesta: 4 perro	
                                </li>	
                                <li>Pasar la apuesta a as. Para esto deberás apostar como mínimo la mitad más 1 de ases.
                                  <br/>
                                  Ejemplo: <i>Última apuesta: 4 tren</i> --> Mi apuesta: 3 as
                                </li>
                              </ol>
                            </li>
                            <li>Si la anterior apuesta <strong>es un as</strong> puedes:
                              <ol>
                                <li>Subir la cantidad de ases.
                                  <br/>
                                  Ejemplo: <i>Última apuesta: 4 as</i> --> Mi apuesta: 5 as
                                </li>
                                <li>Pasar la apuesta a una pinta distinta a as. Para esto deberás apostar como mínimo el doble más 1 de la pinta a apostar.
                                  <br/>
                                  Ejemplo: <i>Última apuesta: 3 as</i> --> Mi apuesta: 7 perro
                                </li>
                              </ol>
                            </li>
                          </ul>
                        </li>
                        <li><strong>El último que queda con dados, es el ganador del juego.</strong></li>
                      </ul>
                      </div>
                    </div>
                    <div className="col-2"></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
          :
          //Loading here
          <div>

          </div>
        }
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(SignedIn)
