'use strict';

angular.module('tatool.auth')
  .factory('authRemoteService', ['$http', '$q', '$base64', '$log', 'userService', 'messageService',
    function($http, $q, $base64, $log, userService, messageService) {

  var authService = {};
 
  // login
  authService.login = function (credentials) {
    var deferred = $q.defer();
    $http.defaults.headers.common.Authorization = 'Basic ' + $base64.encode(credentials.userName + ':' + credentials.userPassword);
    $http.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
    $http.get('/api/login')
      .success(function (data) {
        userService.createSession(credentials.userName, data.token, data.roles);
        deferred.resolve('success');
      })
      .error(function (error) {
        // Erase the session if the user fails to log in
        $log.error(error);
        userService.destroySession();
        deferred.reject('Login failed. Make sure you entered your information correctly.');
      });

    return deferred.promise;
  };

  // logout
  authService.logout = function () {
    userService.destroySession();
    return true;
  };

  // register
  authService.register = function (credentials) {
    var deferred = $q.defer();
    $http.post('/api/register', credentials)
      .success(function () {
        messageService.setMessage({ type: 'success', msg: 'Registration successful. You can go ahead and login now.'});
        deferred.resolve('success');
      })
      .error(function (error) {
        $log.error(error.data);
        deferred.reject(error.message);
      });

    return deferred.promise;
  };
 
  // check whether user is authenticated
  authService.isAuthenticated = function () {
    return userService.isAuthenticated();
  };
  
  return authService;

}]);