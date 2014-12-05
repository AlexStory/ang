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
       vm.newContact.number = vm.formatNumber(vm.newContact.number);
        vm.contacts.push(vm.newContact);
       
        vm.newContact = null;

      }

      vm.removeContact = function(contact){
        var i = vm.contacts.indexOf(contact);
        vm.contacts.splice(i,1);
      }
      vm.formatNumber = function(number){
              if(number.length == 7){
                var newNum = number.toString().split("")
                newNum.splice(3,0,"-");
                return newNum.join("");
                }else{
                 var newNum = number.toString().split("")
                 newNum.unshift("(");  
                 newNum.splice(4,0,") ");
                 newNum.splice(8,0,"-");
                 return newNum.join("");
                }
          }

    });
}());
