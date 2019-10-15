import { Meteor } from 'meteor/meteor';
import { Accounts } from "meteor/accounts-base";
import { WebApp } from "meteor/webapp";
import '../imports/api/partidas.js';
import '../imports/api/board.js';

Meteor.methods({
  crearUsuario: function (user, nombre, password) {
    Accounts.createUser({
      username: user,
      profile: {
        nombre: nombre,
        partidasGanadas: 0,
        juegoActivo:"",
        juegosHistoricos:[],
        onGame: false,
        perdioDado: false
      },
      password: password
    })
  }
});

Meteor.startup(() => {
  WebApp.addHtmlAttributeHook(() => ({ lang: "es" }));
});
});
