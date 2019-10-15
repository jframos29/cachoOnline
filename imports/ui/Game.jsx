/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState} from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Partidas } from "../api/partidas.js";
import { Meteor } from "meteor/meteor";

const Game = (props) => {
	const [miTurno, setMiTurno] = useState(-1);
	const [turnoultimoJugador, setTurnoUltimoJugador] = useState(-1);
	const [pinta, setPinta] = useState("");
	const [sentido, setSentido] = useState(-1);
	const [numDadosApuesta, setNumDadosApuesta]= useState(0);

	if(props.game && props.game.comenzada && miTurno===-1){
		let u;
		for (u = 0; u < props.game.jugadores.length; u++) {
			if (props.game.turnos[u] === props.user.username) {
				setMiTurno(u);
				break;
			}
		}
	}

	if(props.game && props.game.comenzada && props.game.ultimoJugadorSacado===props.user.username){
		alert("Has perdido. Serás redirigido a la pagina principal");
		props.home();
	}

	if(props.game && props.game.comenzada && props.game.turnoUltimoJugador!== turnoultimoJugador && props.game.ultimoJugadorSacado!=="" && props.game.turnoUltimoJugador< miTurno && miTurno!==-1){
		setMiTurno(miTurno-1);
		setTurnoUltimoJugador(props.game.turnoUltimoJugador);
	}


	const comenzar = () => {
		if (props.game.jugadores.length <= 1) {
			alert("Deben agregarse jugadores a la partida para continuar");
		}
		else {
			Meteor.call("comenzarPartida", props.game._id);
		}
	};

	const salir = () => {

		Meteor.call("sacarJugador",miTurno, props.game._id);
		Meteor.call("verificarGanador", props.game._id);
		props.home();

	};

	const proponerJugadaPrimera = (e) => {
		e.preventDefault();
		Meteor.call("asignarSentido", props.game._id, sentido);
		apostar();
	};

	const proponerJugada = (e) => {
		e.preventDefault();
		apostar();
	};

	const apostar = () => {
		let cantidad=numDadosApuesta;
		let ultima = props.game.ultimaJugada;
		let ultimaCantidad = parseInt(ultima.split(" ")[0]);
		let ultimaPinta = ultima.split(" ")[1];
		let valorPinta = 0;
		let valorUltimaPinta = 0;
		
		const valoresPinta = {as:1, pato:2,tren:3,quina:5,cena:6};
		valorPinta = valoresPinta[pinta]
		valorUltimaPinta = valoresPinta[ultimaPinta]

		if (pinta === "as") {
			valorPinta = 1;
		}
		else if (pinta === "pato") {
			valorPinta = 2;
		}
		else if (pinta === "tren") {
			valorPinta = 3;
		}
		else if (pinta === "perro") {
			valorPinta = 4;
		}
		else if (pinta === "quina") {
			valorPinta = 5;
		}
		else if (pinta === "cena") {
			valorPinta = 6;
		}
		
		

		if (ultimaPinta === "as") {
			valorUltimaPinta = 1;
		}
		else if (ultimaPinta === "pato") {
			valorUltimaPinta = 2;
		}
		else if (ultimaPinta === "tren") {
			valorUltimaPinta = 3;
		}
		else if (ultimaPinta === "perro") {
			valorUltimaPinta = 4;
		}
		else if (ultimaPinta === "quina") {
			valorUltimaPinta = 5;
		}
		else if (ultimaPinta === "cena") {
			valorUltimaPinta = 6;
		}

		let x = (ultimaCantidad * 2) + 1;
		if ((cantidad <= props.game.numDadosTotal)&&((valorUltimaPinta === 0) ||
      (cantidad > ultimaCantidad && valorPinta !== 1 && valorUltimaPinta !== 1) ||
      (cantidad > ultimaCantidad && valorPinta === 1 && valorUltimaPinta === 1) ||
      (cantidad >= Math.floor(ultimaCantidad / 2) + 1 && valorPinta === 1 && valorUltimaPinta !== 1) ||
      (cantidad === ultimaCantidad && valorPinta > valorUltimaPinta) ||
      (cantidad >= Math.floor(ultimaCantidad / 2) + 1 && valorPinta === 1 && valorUltimaPinta !== 1) ||
      (cantidad >= x && valorPinta !== 1 && valorUltimaPinta === 1))) {
			Meteor.call("apostar", cantidad, pinta, props.game._id);
			Meteor.call("cambiarTurno", props.game._id);
		}
		else {
			alert("Apuesta no valida! Repita la apuesta");
		}
	};

	const onChangeCantidad = React.useCallback((e) => {
		setNumDadosApuesta(parseInt(e.target.value));
	}, []);

	const onChangePinta = (e) => {
		setPinta(e.target.value);
	};

	const onChangeSentido = (e) => {
		setSentido(parseInt(e.target.value));
	};

	const dudar = () => {

		let ultima = props.game.ultimaJugada;
		let ultimaCantidad = parseInt(ultima.split(" ")[0]);
		let ultimaPinta = ultima.split(" ")[1];
		Meteor.call("dudar", ultimaCantidad, ultimaPinta, props.game._id, (error, result) => {
			if (error) {
				return alert(error.reason);
			}
			else {
				Meteor.call("resultadoDuda", result, props.user.username, props.game._id,(err, result)=>{
					if(error){
						return alert(error.reason);
					}
					else{
						if(result){
							Meteor.call("verificarGanador", props.game._id);
						}
					}
				});
			}
		});
	};


	return props.user && props.game && !props.game.comenzada ?
	// Inicio juego
		<div className="bienvenida">
			<h1>Bienvenido al juego {props.game._id}, {props.user.username}</h1>
			<div className="row">
				<div className="col">
					<button className="btn btn-danger salir" onClick={salir}>Salir de partida</button>
					{
						props.game.admin === props.user.username ?
							<div>
								<button className="btn btn-dark comenzar" onClick={comenzar}>Comenzar partida</button>
							</div>
							:
							<p className="comenzar">
                Espere a que el administrador de la partida comience el juego!!
							</p>
					}
				</div>
				<div className="col">
					<h2>Administrador: {props.game.admin}</h2>
					<h2>Jugadores Actuales:</h2>
					{
						props.game.jugadores.map((element, i) => {
							return <h5 className="jugador" key={i}><strong>Usuario:</strong> {element} </h5>;
						})
					}
				</div>
			</div>
		</div>
		:
		props.game && props.game.comenzada && !props.game.terminada && props.user.username === props.game.turnos[props.game.turnoActual] && props.game.sentidoRonda === -1 && props.game.dados[miTurno]
			?
		// Vista de jugador en turno cuando no hay sentido definido


			<div className="bienvenida">
				<h1>Estás en el juego {props.game._id}, {props.user.username}</h1>
				<div className="row">
					<div className="col">
						<button className="btn btn-danger salir" onClick={salir}>Salir de partida</button>
						<h4><strong>Hay {props.game.numDadosTotal} dados en juego</strong></h4>
						<h5><strong>Ultima jugada:</strong> {props.game.ultimaJugada !== "" ? props.game.ultimaJugada : "No existe ultima jugada"}</h5>

						<h5>Proponer jugada:</h5>
						<div className="row">
							<div className="col-8">
								<form className="form">
									<select onChange={onChangeSentido} className="browser-default custom-select custom-select mb-3 form-control" required>
										<option value="">Selecciona la dirección</option>
										<option value="0">Derecha</option>
										<option value="1">Izquierda</option>
									</select>
									<input required type="number" placeholder="Selecciona la cantidad" className="mb-3 form-control" onChange={onChangeCantidad} step="1" max={props.game.numDadosTotal} min="1"></input>

									<select required onChange={onChangePinta} className="browser-default custom-select custom-select mb-3 form-control">
										<option value="">Selecciona pinta</option>
										<option value="as">As</option>
										<option value="pato">Pato</option>
										<option value="tren">Tren</option>
										<option value="perro">Perro</option>
										<option value="quina">Quina</option>
										<option value="cena">Cena</option>
									</select>
									<button type="submit" onClick={proponerJugadaPrimera} className="btn btn-dark">Apostar</button>
								</form>
							</div>
							<div className="col-4"></div>
						</div>

					</div>
					<div className="col">
						<h2>Administrador: {props.game.admin}</h2>
						<h2>Jugadores Actuales:</h2>

						{
							props.game.jugadores.map((element, i) => {
								return <h5 className="jugador" key={i}><strong>Usuario:</strong> {element} </h5>;
							})
						}
						<div className="info"><h5><strong>Jugador Turno actual:</strong></h5><h5>{props.game.turnos[props.game.turnoActual]}</h5></div>

						<div className="info"><h5><strong>Tus dados:</strong></h5><h5>{props.game.dados[miTurno].toString()}</h5></div>

					</div>
				</div>
			</div>

			:
			props.game && props.game.comenzada && !props.game.terminada && props.user.username === props.game.turnos[props.game.turnoActual] && props.game.sentidoRonda !== -1 && props.game.dados[miTurno]
				?
			// Vista de jugador en turno cuando hay sentido definido

				<div className="bienvenida">
					<h1>Estás en el juego {props.game._id}, {props.user.username}</h1>
					<div className="row">
						<div className="col">
							<button className="btn btn-danger salir" onClick={salir}>Salir de partida</button>
							<h4><strong>Hay {props.game.numDadosTotal} dados en juego</strong></h4>
							<h5><strong>Ultima jugada:</strong> {props.game.ultimaJugada !== "" ? props.game.ultimaJugada : "No existe ultima jugada"}</h5>
							<button onClick={dudar} className="btn btn-dark dudar">Dudar</button>

							<h5>Proponer jugada:</h5>
							<div className="row">
								<div className="col-8">
									<form className="form">
										<input required type="number" placeholder="Selecciona la cantidad" className="mb-3 form-control" onChange={onChangeCantidad} step="1" max={props.game.numDadosTotal} min="1"></input>

										<select required onChange={onChangePinta} className="browser-default custom-select custom-select mb-3 form-control">
											<option value="">Selecciona pinta</option>
											<option value="as">As</option>
											<option value="pato">Pato</option>
											<option value="tren">Tren</option>
											<option value="perro">Perro</option>
											<option value="quina">Quina</option>
											<option value="cena">Cena</option>
										</select>
										<button type="submit" onClick={proponerJugada} className="btn btn-dark">Apostar</button>
									</form>
								</div>
								<div className="col-4"></div>
							</div>

						</div>
						<div className="col">
							<h2>Administrador: {props.game.admin}</h2>
							<h2>Jugadores Actuales:</h2>

							{
								props.game.jugadores.map((element, i) => {
									return <h5 className="jugador" key={i}><strong>Usuario:</strong> {element} </h5>;
								})
							}
							<div className="info"><h5><strong>Jugador Turno actual:</strong></h5><h5>{props.game.turnos[props.game.turnoActual]}</h5></div>
							<div className="info"><h5><strong>Tus dados:</strong></h5><h5>{props.game.dados[miTurno].toString()}</h5></div>
						</div>
					</div>
				</div>

				:
				props.game && props.game.comenzada &&!props.game.terminada && props.game.dados[miTurno] ?

					<div className="bienvenida">
						<h1>Estás en el juego {props.game._id}, {props.user.username}</h1>
						<div className="row">
							<div className="col">
								<button className="btn btn-danger salir" onClick={salir}>Salir de partida</button>
								<h4><strong>Hay {props.game.numDadosTotal} dados en juego</strong></h4>
								<h5><strong>Ultima jugada:</strong> {props.game.ultimaJugada !== "" ? props.game.ultimaJugada : "No existe ultima jugada"}</h5>
							</div>
							<div className="col">
								<h2>Administrador: {props.game.admin}</h2>
								<h2>Jugadores Actuales:</h2>

								{
									props.game.jugadores.map((element, i) => {
										return <h5 className="jugador" key={i}><strong>Usuario:</strong> {element} </h5>;
									})
								}
								<div className="info"><h5><strong>Jugador Turno actual:</strong></h5><h5>{props.game.turnos[props.game.turnoActual]}</h5></div>
								<div className="info"><h5><strong>Tus dados:</strong></h5><h5>{props.game.dados[miTurno].toString()}</h5></div>
							</div>
						</div>
					</div>
					: props.game && props.game.terminada && props.game.dados[miTurno] ?
						<div>
							<h1>El juego {props.game._id} ha terminado</h1>
							<h2>Ganador: {props.game.ganador}</h2>
							<button className="btn btn-danger salir" onClick={salir}>Salir de partida</button>
						</div>
						:
						<div>
							<h1>Cargando</h1>
						</div>;
};

export default AppWrapper = withTracker((props) => {
	Meteor.subscribe("myGame", props.match.params.gameId);
	return {
		user: Meteor.user(),
		game: Partidas.findOne({ _id: props.match.params.gameId })
	};
})(Game);
