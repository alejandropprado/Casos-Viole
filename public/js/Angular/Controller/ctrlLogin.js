app.controller('loginCtrl', 
  ['$scope', 
  'loginApi', 
  '$location', 
  '$state', 
  'notify',
  function($sp, loginApi, $location, $state, notify){

    $sp.cargandoRegistro = false;
    try {
      window.localStorage.removeItem('token');
    } catch(e) {
      console.log(e);
    }

    $sp.login = function(user){
      $sp.cargandoLogin = true;
      loginApi.login(user).then( function(resp){
        var token = JSON.stringify(resp.data);      
        window.localStorage.setItem('token', token);      
        $state.go('home.dashboard');
        cargandoLogin =false;
      }, function (err) {
        notify({
          message: 'El usuario o contraseña no son validos.',
          duration: 10000,
          classes: 'alert-danger',
          position : 'center'
        });
        cargandoLogin =false;
      });
    };

    $sp.signup = function(user){
      $sp.cargandoRegistro = true;
      loginApi.signup(user).then( function(resp){
        notify({
          message: 'Su registro se ha realizado con éxito, le hemos enviado un email para que valida su cuenta.',
          duration: 10000,
          classes: 'alert-success',
          position : 'center'
        });
        $sp.userR = {};
        $sp.cargandoRegistro = false;
      },function(err){
        notify({
          message: 'Ha ocurrido un error al registrar su cuenta, compruebe los datos e intente nuevamente.',
          duration: 100000,
          classes: 'alert-danger',
          position : 'center'
        });
        $sp.cargandoRegistro = false;
      });
    };

  }]);