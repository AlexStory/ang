var ng = angular
;(function(){
  'use strict';

  ng.module('myAddressBook', [])
    .controller('AddressController', function(){
      var vm = this;
      vm.contacts = [
        {
          name: 'Jenny',
          address: 'The Block',
          number: '867-5309'
        }, {
          name: 'Batman',
          address: 'Batcave, Gotham',
          number: 'Bat-signal'
        }, {
          name: 'Superman',
          address: 'Chamber of Solitude, North Pole',
          number: 'superhearing'
        }
      ];
      vm.addNewContact = function(){
        vm.contacts.push(vm.newContact);
        vm.newContact = null;
      }

      vm.removeContact = function(contact){
        var i = vm.contacts.indexOf(contact);
        vm.contacts.splice(i,1);
      }

    });

}());
