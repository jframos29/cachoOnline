import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export const Partidas = new Mongo.Collection("games");

if (Meteor.isServer) {
	Meteor.publish("myGame", (id1) => {
		return Partidas.find({ _id: id1 });
	});
}

function darDados(numDados) {
	let k;
	let arr = [];
	for (k = 0; k < numDados; ++k) {
		arr.push(Math.floor(Math.random() * 6) + 1);
	}
	return arr;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function mod(a, b) {
	return (a % b + b) % b;
}


Meteor.methods({

	createPartida: function (admin) {

		let a = Partidas.insert({
			admin: admin,
			comenzada: false,
			jugadores: [admin],
			turnos: [],
			numDados: [],
			numDadosTotal: 0,
			dados: [],
			terminada: false,
			ganador: undefined,
			turnoActual: -1,
			//sentido derecha: 0 --- sentido izquierda: 1
			sentidoRonda: -1,
			ultimaJugada: "",
			ultimoJugadorSacado:"",
			turnoUltimoJugador:-1
    });
	console.log(this.userId);
	let res2 = Meteor.users.findOne({ _id: this.userId });
	console.log(res2);
		res2.profile.juegosHistoricos.push(a);
		res2.profile.juegoActivo = a;
		Meteor.users.update({ _id: this.userId }, res2);
		return a;
	},

	comenzarPartida: function (idPartida) {

		let res = Partidas.findOne({ _id: idPartida });
		res.comenzada = true;
		res.turnos = shuffle(res.jugadores);
		let i, j;
		let numDadosTotal = 0;
		for (i = 0; i < res.jugadores.length; ++i) {
			res.numDados.push(6);
			numDadosTotal += 6;
		}
		res.numDadosTotal = numDadosTotal;
		for (j = 0; j < res.jugadores.length; ++j) {
			res.dados.push(darDados(res.numDados[j]));
		}
		let r = res.turnoActual;
		r++;
		res.turnoActual = r;
		Partidas.update({ _id: idPartida }, res);
	},

	//HISTORICO  db.users.findOne({username:"luznelly"}).profile.juegos


	joinPartida: function (idPartida, idJugador) {

		let res = Partidas.findOne({ _id: idPartida });

		if (typeof (res) === "undefined") {
			throw new Meteor.Error("No existe la partida");
		}
		else if (res.jugadores.length === 6) {
			throw new Meteor.Error("El juego esta lleno");
		}
		else if (res.comenzada) {
			throw new Meteor.Error("La partida ya comenzó");
		}
		else {
			res.jugadores.push(idJugador);
			Partidas.update({ _id: idPartida }, res);
			let res2 = Meteor.users.findOne({ username: idJugador });
			res2.profile.juegosHistoricos.push(idPartida);
			res2.profile.juegoActivo = idPartida;
			Meteor.users.update({ username: idJugador }, res2);
		}
	},

	apostar: function (cantidad, pinta, idPartida) {
		let res = Partidas.findOne({ _id: idPartida });
		let apuesta = cantidad + " " + pinta;
		res.ultimaJugada = apuesta;
		Partidas.update({ _id: idPartida }, res);
	},

	asignarSentido: function (idPartida, sentido) {
		let res = Partidas.findOne({ _id: idPartida });
		res.sentidoRonda = sentido;
		Partidas.update({ _id: idPartida }, res);
	},

	cambiarTurno: function (idPartida) {
		let res = Partidas.findOne({ _id: idPartida });
		if (res.sentidoRonda === 0) {
			let a = res.turnoActual + 1;
			let b = res.jugadores.length;
			res.turnoActual = mod(a, b);
		}
		else if (res.sentidoRonda === 1) {
			let a = res.turnoActual - 1;
			let b = res.jugadores.length;
			res.turnoActual = mod(a, b);
		}
		Partidas.update({ _id: idPartida }, res);
	},

	dudar: function (cantidad, pinta, idPartida) {
		let res = Partidas.findOne({ _id: idPartida });
		let valorPinta = 0;
		let contador = 0;
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
		let a = res.dados.length;
		for (let i = 0; i < a; ++i) {
			let b = res.dados[i];
			for (let j = 0; j < b.length; ++j) {
				if (parseInt(res.dados[i][j]) === valorPinta || parseInt(res.dados[i][j]) === 1) {
					contador++;
				}
			}
		}

		if (contador >= cantidad) {
			return true;
		}
		else {
			return false;
		}
	},

	resultadoDuda: function (result, username, idPartida) {
		let res = Partidas.findOne({ _id: idPartida });
		let turnos = res.turnos;
		let pos = -1;
		let sentido = res.sentidoRonda;
		for (let i = 0; i < turnos.length; ++i) {
			if (turnos[i] === username) {
				pos = i;
				break;
			}
		}
		let jug = res.jugadores.length;
		res.sentidoRonda = -1;
		res.ultimaJugada = "";
		if (result) {
			//res.dados[pos].length = aLength-1;
			res.numDados[pos] = res.dados[pos].length - 1;
			if (res.numDados[pos] !== 0) {
				res.dados = [];
				res.numDadosTotal = 0;
				let j;
				for (j = 0; j < jug; ++j) {
					res.dados.push(darDados(res.numDados[j]));
					res.numDadosTotal += res.numDados[j];
				}
				Partidas.update({ _id: idPartida }, res);
				return false;
			}
			else {
				Meteor.call("sacarJugador", pos, idPartida);
				return true;
			}
		}
		else {
			if (sentido === 0) {
				res.turnoActual = mod((pos - 1), jug);
				let b = res.dados[mod((pos - 1), jug)];
				let bLength = b.length;
				b.length = bLength - 1;
				res.numDados[mod((pos - 1), jug)] = res.dados[mod((pos - 1), jug)].length;
				if (res.numDados[mod((pos - 1), jug)] !== 0) {
					res.dados = [];
					res.numDadosTotal = 0;
					let j;
					for (j = 0; j < jug; ++j) {
						res.dados.push(darDados(res.numDados[j]));
						res.numDadosTotal += res.numDados[j];
					}
					Partidas.update({ _id: idPartida }, res);
					return false;
				}
				else {
					Meteor.call("sacarJugador", mod((pos - 1), jug), idPartida);
					return true;
				}
			}
			else if (sentido === 1) {
				res.turnoActual = mod((pos + 1), jug);
				let b = res.dados[mod((pos + 1), jug)];
				let bLength = b.length;
				b.length = bLength - 1;
				res.numDados[mod((pos + 1), jug)] = res.dados[mod((pos + 1), jug)].length;
				if (res.numDados[mod((pos + 1), jug)] !== 0) {
					res.dados = [];
					res.numDadosTotal = 0;
					let j;
					for (j = 0; j < jug; ++j) {
						res.dados.push(darDados(res.numDados[j]));
						res.numDadosTotal += res.numDados[j];
					}
					Partidas.update({ _id: idPartida }, res);
					return false;
				}
				else {
					Meteor.call("sacarJugador", mod((pos + 1), jug), idPartida);
					return true;
				}
			}
		}
	},
	sacarJugador: function (posicion, idPartida) {
		let res = Partidas.findOne({ _id: idPartida });
		let username=res.jugadores[posicion];
		res.turnos.splice(posicion, 1);
		res.jugadores.splice(posicion, 1);
		res.ultimoJugadorSacado=username;
		res.turnoUltimoJugador=posicion;
		Partidas.update({_id:idPartida},res);
		let res2 = Meteor.users.findOne({ username: username });
		res2.profile.juegoActivo = "";
		Meteor.users.update({ username: username }, res2);
		return true;
	},
	verificarGanador: function (idPartida) {
		let res = Partidas.findOne({ _id: idPartida });
		if (res.jugadores.length === 1) {
			res.terminada = true;
			res.ganador = res.jugadores[0];
			Meteor.call("actualizarVictoria", res.jugadores[0]);
			Partidas.update({_id:idPartida},res);
		}
	}
});


