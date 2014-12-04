var ng = angular
;(function(){
  'use strict';

  ng.module('myTodoApp', [])
    .controller('TodoController', function(){
      var vm = this;
      vm.tasks = [
        {
          name: 'Learn Angular',
          desc: 'If I could learn Angular I\'d be sooo happy',
          due: 'today'
        }, {
          name: 'Finish Tic-Tac-Toe',
          desc: 'Firebase AAARRRRGGHHH',
          due: 'Monday'
        }, {
          name: 'Get A Job',
          desc: 'Get dat money',
          due: 'April 2015'
        }
      ];
      vm.addNewTask = function(){
        vm.tasks.push(vm.newTask);
        vm.newTask = null;
      }

      vm.removeTodo = function(task){
        var i = vm.tasks.indexOf(task);
        vm.tasks.splice(i,1);
      }

    });

}());
