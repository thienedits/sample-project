(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authFactory', authFactory); 

  // authFactory.$inject = ['$firebaseAuth', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL'];
  
  /* @ngInject */  
  function authFactory($firebaseAuth, $firebaseObject, $firebaseArray, FIREBASE_URL, $http, exception) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    var matches = ref.child('matches');
    var userMatches = ref.child('user_matches');

    var Auth = {
      register: function (user) {
        return auth.$createUser({
          email: user.email,
          password: user.password
        });
      },
      createProfile: function (user) {
        var profile = {
          username: user.username,
          profileImageURL: user.password.profileImageURL
        };

        var profileRef = ref.child('profile');
        return profileRef.child(user.uid).set(profile);
      },
      login: function (user) {
        return auth.$authWithPassword({
          email: user.email,
          password: user.password
        });
      },
      logout: function () {
        auth.$unauth();
      },
      import: function(user) {
        // return matches.$add(match).then(function(postRef) {
        //     ref.child('user_matches').child(match.playerUID)
        //         .push(postRef.key());
        //     return postRef;
        // });
        var params = {
          username: user.profile.username,
          uid: user.uid
        };

        return $http.post('/api/importMatches', params).
        then(function(response) {
          return response.data;
        }, function(e) {
          return exception.catcher('XHR Failed for importing matches')(e);
        });

      },
      updateMatches: function(user) {
        // return matches.$add(match).then(function(postRef) {
        //     ref.child('user_matches').child(match.playerUID)
        //         .push(postRef.key());
        //     return postRef;
        // });
        var params = {
          username: user.profile.username,
          uid: user.uid
        };

        return $http.post('/api/updateCurrentYear', params).
        then(function(response) {
          return response.data;
        }, function(e) {
          return exception.catcher('XHR Failed for updating matches')(e);
        });

      },
      getMatches: function (user) {
        //var uid =  user.uid;
        //console.log(uid);
        //var obj = $firebaseArray(userMatches.child(uid));
        return userMatches.child(user.uid);
      },
      requireAuth: function () {
        return auth.$requireAuth();
      },
      user: function() {
        if(auth.$getAuth()) {
          console.log('User:', auth.$getAuth());
        }
        
        return auth.$getAuth();
      },
      getProfile: function(uid) {
        return $firebaseObject(ref.child('profile').child(uid));
      },
      ref: function() {
        return ref;
      }
    };

    return Auth;
  }
})();