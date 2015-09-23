(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('AnalyticsFactory', AnalyticsFactory); 
  
  /* @ngInject */  
  function AnalyticsFactory($firebaseArray, authFactory) {
    var user = authFactory.user();
    user.profile = authFactory.getProfile(user.uid);
     // create a new service based on $firebaseArray
    return AnalyticsFactory = $firebaseArray.$extend({
      getTotal: function() {
        var wins = 0;
        var loss = 0;
        // the array data is located in this.$list
        angular.forEach(this.$list, function(val, key) {
          if(val.winner.indexOf(user.profile.username) > -1) {
            wins++;
          } else {
            loss++;
          }
        });
        
        return {
          wins: wins,
          loss: loss
        };
        
      }
    });
  }
})();