var ng = angular
;(function() {
  "use strict";

  ng.module("myAddressBook", [ "ngRoute" ])
    .config(function($routeProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/table.html",
          controller: "AddressController",
          controllerAs: "addressctrl"
        })
        .when("/new", {
          templateUrl: "views/new.html",
          controller: "AddressController",
          controllerAs: "addressctrl"
        })
        .when("/contact/:id", {
          templateUrl: "views/show.html",
          controller: "ShowController",
          controllerAs: "show"
        });
    })
    .factory("addressFactory", function() {
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

      return {
        formatNumber: formatNumber
      };
    })
    .controller("ShowController", function($http, $routeParams, $location, addressFactory) {
      var vm = this,
          id = $routeParams.id,
          fb = "https://phonebook-alex.firebaseio.com/list/"
      $http.get(fb + id + ".json")
          .success(function(data) {
            vm.contact = data;
          });

      vm.toggle = function(key) {
        var change = "edit" + key;
        vm[change] = !vm[change];
      };

      vm.edit = function(loc, obj) {
        var url = fb + id + ".json";
        console.log(obj);
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
      vm.remove = function() {
        var url = fb + id + ".json" ;
        $http.delete(url)
          .success(function(data) {
            $location.path("/");
          });
      };
    })
    .controller("AddressController", function($http, $location, addressFactory) {
      var vm = this,
          fb = "https://phonebook-alex.firebaseio.com/list/";

      vm.getData = function() {
        $http.get(fb + ".json")
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
        $http.post(fb + ".json", vm.newContact)
          .success(function(data) {
            vm.contacts[data.name] = vm.newContact;
            $location.path("/contact/" + data.name);
          });
      };

      vm.removeContact = function(id) {
        var url = fb + id + ".json" ;
        $http.delete(url)
          .success(function(data) {
            delete vm.contacts[id];
          });
      };
    });
}());
