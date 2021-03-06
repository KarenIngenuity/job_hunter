/* global angular */

(function () {
  "use strict";

  angular.module("app").controller("jobsCtrl", function($scope, $http, $window) {
    $scope.setup = function() {
      $http.get('/api/v1/jobs.json').then(function(response){
        $scope.jobs = response.data;
        $scope.notYetAppliedJobs = [];
        $scope.applyingJobs = [];
        $scope.appliedJobs = [];
        $scope.interviewSetupJobs = [];
        $scope.interviewedJobs = [];
        $scope.noOfferJobs = [];
        $scope.offeredJobs = [];

        $scope.updatedStatus = [];

        $scope.statuses = ["not_yet_applied", "applying_to", "applied_to", "interview_set_up", "interviewed_with", "job_offered", "no_offer"];

        console.log("hello");


        for(var i = 0; i < $scope.jobs.length; i++){
          if ($scope.jobs[i].status == "not_yet_applied"){
            $scope.notYetAppliedJobs.push($scope.jobs[i]);
          }
          else if ($scope.jobs[i].status == "applying_to"){
            $scope.applyingJobs.push($scope.jobs[i]);
          }
          else if ($scope.jobs[i].status == "applied_to"){
            $scope.appliedJobs.push($scope.jobs[i]);
          }
          else if ($scope.jobs[i].status == "interview_set_up"){
            $scope.interviewSetupJobs.push($scope.jobs[i]);
          }
          else if ($scope.jobs[i].status == "interviewed_with"){
            $scope.interviewedJobs.push($scope.jobs[i]);
          }
          else if ($scope.jobs[i].status == "job_offered"){
            $scope.offeredJobs.push($scope.jobs[i]);  
          }
          else if ($scope.jobs[i].status == "no_offer"){
            $scope.noOfferJobs.push($scope.jobs[i]);
          }                                                  
        };                                                 
      });
    };

    $scope.setOrderAttribute = function(inputAttribute) {
      if (inputAttribute !== $scope.orderAttribute) { // clicked on a different button
        $scope.isOrderDescending = false;  
      } else {
        $scope.isOrderDescending = !$scope.isOrderDescending;     
      }
      $scope.orderAttribute = inputAttribute;

      if($scope.isOrderDescending === false) {
        $scope.direction = "v"
      } else {
        $scope.direction = "^"
      }                      

    };

    $scope.searchIndeed = function(inputKeyword, inputLocation){
      var apiUrl = "api/v1/jobs/search?keyword=" + inputKeyword + "&location=" + inputLocation;
      $http.get(apiUrl).then(function(response) {
        $scope.searchResults = response.data;
        $scope.showResults = true;
      });
    };

    $scope.saveListing = function(result){
      var params = {
        company: result.company,
        position: result.jobtitle,
        source: "Indeed",
        city: result.city,
        state: result.state,
        listing_url: result.url,
        status: "not_yet_applied",
        notes: result.date,
      };
      $http.post("/api/v1/jobs", params).then(function(response){
        console.log("NEW INDEED JOB SAVED")
        result.saved = true;
      }) ;
    }

    $scope.updateStatus = function(inputJob, inputStatus){
      var updatedJob = inputJob;
      console.log(updatedJob);
      var params = {
        company: updatedJob.company,
        position: updatedJob.position,
        source: updatedJob.source,
        status: inputStatus
      }
      console.log(inputStatus);

      updatedJob.status = inputStatus;
      console.log(updatedJob.status);
      $http.patch('/api/v1/jobs/' + updatedJob.id + '.json', params).then(function(response){
        console.log(updatedJob);
      });
      $scope.setup();
    };


    $scope.addJob = function(inputCompany, inputPosition, inputSource, inputNotes, inputStatus) {
      var params = {
        company: inputCompany,
        position: inputPosition,
        source: inputSource,
        notes: inputNotes,
        status: inputStatus
      };

      $http.post('/api/v1/jobs.json', params).then(function(response) {
        $scope.jobs.push(response.data);
        console.log(params);
      });
      $scope.inputCompany = "";
      $scope.inputPosition = "";
      $scope.inputSource = "";
      $scope.inputNotes = "";
      $scope.setup();
    };

    window.$scope = $scope;
   
    $scope.message = "Hello world";
  });
})();