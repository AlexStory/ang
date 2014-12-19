;(function() {
  "use strict";

  angular.module("myAddressBook", [ "ngRoute" ])
    .config(function($routeProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/_table.html",
          controller: "AddressController",
          controllerAs: "addressctrl"
        })
        .when("/new", {
          templateUrl: "views/_new.html",
          controller: "AddressController",
          controllerAs: "addressctrl"
        })
        .when("/contact/:id", {
          templateUrl: "views/_show.html",
          controller: "ShowController",
          controllerAs: "show"
        })
        .when("/login", {
          templateUrl: "views/_login.html",
          controller: "loginController",
          controllerAs: "login"
        });
    })
    .factory("addressFactory", function($http, $rootScope) {
      var fb = "https://phonebook-alex.firebaseio.com/users/";
      function formatNumber(number) {
        var newNum;
        if (!number) {
          return "N/A";
        } else {
          if (number.length == 7) {
            newNum = number.toString().split("");
            newNum.splice(3, 0, "-");
            return newNum.join("");
          } else {
            newNum = number.toString().split("");
            newNum.unshift("(");
            newNum.splice(4, 0, ") ");
            newNum.splice(8, 0, "-");
            return newNum.join("");
          }
        }
      };

      function removeFile(id, cb) {
        $http.delete(fb + $rootScope.user.uid + "/list/" + id + ".json")
          .success(function(data) {
            cb(data);
          })
      }

      return {
        formatNumber: formatNumber,
        removeFile: removeFile
      };
    })
    .controller("ShowController", function($http, $routeParams, $location, addressFactory, $rootScope) {
      var vm = this,
          id = $routeParams.id,
          fb = "https://phonebook-alex.firebaseio.com/users/"
      $http.get(fb + $rootScope.user.uid + "/list/" + id + ".json")
          .success(function(data) {
            vm.contact = data;
          });

      vm.toggle = function(key) {
        var change = "edit" + key;
        vm[change] = !vm[change];
      };

      vm.edit = function(loc, obj) {
        var url = fb + id + ".json";
        if (obj.number) {
          obj.number = addressFactory.formatNumber(obj.number)
        }
        $http.patch( url, obj )
          .success(function() {
            for (var key in obj) {
              vm.contact[key] = obj[key];
              vm.toggle(key);
            }
          });
      };
      vm.removeContact = function() {
        addressFactory.removeFile(id, function(data) {
          $location.path("/");
        });
      }
    })
    .controller("AddressController", function($http, $location, addressFactory, $rootScope) {
      var vm = this,
          fb = "https://phonebook-alex.firebaseio.com/users/";

      vm.getData = function() {
        $http.get(fb + $rootScope.user.uid +   "/list.json")
          .success(function(data) {
            vm.contacts = data;
          });
      };
      vm.getData();

      vm.addNewContact = function() {
       vm.newContact.number = addressFactory.formatNumber(vm.newContact.number);
       if (!vm.newContact.address) {
         vm.newContact.address = "N/A";
       }
        $http.post(fb + $rootScope.user.uid + "/list/.json", vm.newContact)
          .success(function(data) {
            vm.contacts = vm.contacts || {};
            vm.contacts[data.name] = vm.newContact;
            $location.path("/contact/" + data.name);
          });
      };

      vm.removeContact = function(id) {
        addressFactory.removeFile(id, function() {
          delete vm.contacts[id];
        })
      };
    })
    .controller("loginController", function($scope, $location, $rootScope) {
      var vm = this,
          fb = "https://phonebook-alex.firebaseio.com/users/",
          ref = new Firebase(fb);

      vm.login = function() {
        ref.authWithPassword({
          email: vm.email,
          password: vm.password
        }, function(error, authData) {
          if (error === null) {
            $rootScope.user = ref.getAuth();
            $location.path("/");
            $scope.$apply();
          } else {
            console.log("Error authenticating user:", error);
          }
        });
      }

      vm.register = function() {
        ref.createUser({
          email: vm.email,
          password: vm.password
        }, function(error, authData) {
          if (error === null) {
            console.log("User created successfully");
            ref.child(authData.uid).child("authData").set(authData);
            vm.login();
          } else {
            console.log("Error creating user:", error);
          }
        });
      }
    });
}());
