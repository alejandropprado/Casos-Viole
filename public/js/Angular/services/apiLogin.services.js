app.service('loginApi', ['$http', function($http){

  this.login = function(user){
    return $http({
      method:'POST',
      skipAuthorization : false,
      url:'/auth/login',
      data: user
    });
  };

  this.signup = function(user){
    return $http({
      method:'POST',
      skipAuthorization :false,
      url:'/auth/signup',
      data: user
    });
  };

}]);