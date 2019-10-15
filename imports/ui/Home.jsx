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
				<h2>Entra e inicia la diversión!</h2>
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
		</div>;
};

export default AppWrapper = withTracker(() => {
	return {
		user: Meteor.user()
	};
})(Home);
