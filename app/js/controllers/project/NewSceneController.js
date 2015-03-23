'use strict';

app.controller('NewSceneController', ['$scope', 'RequestService', '$stateParams', '$rootScope', 'Project', '$state', function ($scope, RequestService, $stateParams, $rootScope, Project, $state) {


    $scope.currentProjectId = $stateParams['projectId'];

    function setCurrentProjectName(){
        for (var i in $scope.projects) {
            if($scope.projects[i].id == $scope.currentProjectId){
                $scope.currentProjectName = $scope.projects[i].title;
                return;
            }
        }
    }

    $scope.projects = Project.get(function(projects){
        $scope.projects = projects;
        setCurrentProjectName();
    });
    if($scope.projects.length > 0){
        setCurrentProjectName();
    }

    $scope.onProjectSelect = function(id){
        $scope.currentProjectId = id;
    };

    $scope.newScene = {
        title: null,
        description: null
    };

    $scope.createNewScene = function(){
        var data = {
            project: {id: $scope.currentProjectId},
            scene: {
                title: $scope.newScene.title
            }
        };

        if($scope.newScene.title){
            RequestService.post('scenes/create', data, function(res) {
                    //if a scene is added to another than current project the view is switched to the other project
                    if($stateParams['projectId'] != $scope.currentProjectId){
                        $state.go('user.project.scenes', {username: $stateParams['username'], projectId: $scope.currentProjectId})
                    }
                    $rootScope.$emit('newSceneCreated', res.data);
                }, function(error) {
                    console.log(error);
                }
            );
        }
    }
}]);