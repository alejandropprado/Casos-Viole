app.service('ApiConsultorios', ['$http','$q', function($http,$q){
  this.Api = function(method,url,data){
    var deferred = $q.defer();
    var options = {};

    options.skipAuthorization = false;

    switch (method) {
      case 'GET':
      options.method = method;
      options.url = url;      
      break;
      case 'POST':
      options.method = method;
      options.url = url;    
      options.data = data 
      break;
      case 'DELETE':
      options.method = method;
      options.url = url;  
      break;
      case 'PUT':
      options.method = method;
      options.url = url;    
      options.data = data 
      break;
    }

    $http(options).success(function(data){
      deferred.resolve(data);
    })
    .error(function(msg,code){
      deferred.reject(msg);
    });
    return deferred.promise;
  };
  
}]);