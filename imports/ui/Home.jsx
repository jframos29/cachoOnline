/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from "react";
import SignedIn from "./SignedIn.jsx";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";


const Home = (props) => {
	return props.user ?
		<div>
			<h1>Bienvenido a Cacho {props.user.profile.nombre}</h1>
			<SignedIn game={props.game} leader={props.leader} joinGame={props.joinGame} joinGameNow={props.joinGameNow} historial={props.historial} />
		</div>
		:
		<div id="welcome">
			<div className="d-flex justify-content-center" >
				<h1>Bienvenido a Cacho</h1>
			</div>
			<div className="d-flex justify-content-center" >
				<h4>Entra e inicia la diversión!</h4>
			</div>
			<div className="d-flex justify-content-center" >
				<p>1.Inicia sesión o regístrate</p>
			</div>
			<div className="d-flex justify-content-center" >
				<p>2.Crea un nuevo juego o ingresa a uno ya creado con el Id visualizado dentro del juego </p>
			</div>
			<div className="d-flex justify-content-center" >
				<p>3.Divierte con cacho!</p>

			</div>
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
			
		</div>;
};

export default AppWrapper = withTracker(() => {
	return {
		user: Meteor.user()
	};
})(Home);