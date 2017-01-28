'use strict';

var app = angular.module('tesEIS', ['ngAnimate', 'ui.bootstrap']);
app.controller('myctrl', function($scope, $http) {
  $scope.var = {hidForm:true,edit:false};
  $scope.form = {};
  $scope.barang = [];
  $scope.start = 0;
  $scope.limit = 15;
  $scope.limit_inp = 15;
  $scope.save = function(){
    $http.post('/api/barang', $scope.form)
      .success(function(data) {
        if(data.stat != 1) return alert('fail to save data');
        $scope.get();
        $scope.form = {};
      });
  }
  $scope.reset_fm = function(){
    $scope.var.hidForm=true;
    $scope.form={};
  }
  $scope.edit_fm = function(n){
    $scope.selected_row=n;
    $scope.form = angular.copy($scope.nut[n]);
    $scope.var.hidForm=false;
    $scope.var.edit=true;
  }
  $scope.edit = function(){
    $http.put('/api/barang/'+$scope.nut[$scope.selected_row].id, $scope.form)
      .success(function(data, status) {
        if(status != 200) return false && console.log('edit status:', status);
        $scope.nut[$scope.selected_row] = $scope.form;
        $scope.reset_fm();
      });
  }
  $scope.del = function(n){
    if(confirm("Sure?")) $http.delete('/api/barang/'+$scope.nut[n].id)
      .success(function(data) {
        $scope.barang.splice(n, 1);
      });
  }
  $scope.set_limit = function(){
    if(isNaN($scope.limit))return $scope.limit=15;
    else $scope.get();
  }
  $scope.prev_page = function(){
    if($scope.start < $scope.limit)return;
    $scope.start = $scope.start - $scope.limit;
    $scope.get();
  }
  $scope.next_page = function(){
    if($scope.total <= ($scope.start - (-$scope.limit)))return;
    $scope.start = $scope.start - (-$scope.limit);
    $scope.get();
  }
  $scope.get = function(){
    var query = 'start='+$scope.start+'&limit='+$scope.limit;
    $http.get('/api/barang?'+query)
    .success(function(data, status, headers, config) {
      $scope.barang = data.data;
      $scope.total = data.total;
      $scope.stop = $scope.start + $scope.barang.length;
    });
  }
  $scope.get();
});
