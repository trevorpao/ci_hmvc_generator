
'use strict';

angular.module('project', ['mongolab']).config(function($routeProvider) {
    $routeProvider.
    when('/', {controller:ListCtrl, templateUrl:'list.html'}).
    otherwise({redirectTo:'/'});
});


function ListCtrl($scope, Project, ModuleData) {
    $scope.module = ModuleData.name;
    $scope.projects = Project.query({module: ModuleData.name});

    $scope.isClean = function() {
        return false;
    }

    $scope.destroy = function(project) {
        project = new Project(project);
        project.destroy(function() {
            $scope.projects = Project.query({module: ModuleData.name});
        });
    };

    $scope.query = function() {
        if ($scope.module!=ModuleData.name) {
            ModuleData.switch($scope.module);
            $scope.projects = Project.query({module: ModuleData.name});
        }
        else {
            alert("Please change module name!!");
        }
    };

    $scope.addColumn = function() {
        Project.save({}, function(project) {
            $scope.projects = Project.query({module: ModuleData.name});
        });
    };

    $scope.save = function(project) {
        project = new Project(project);

        project.update(function() {

        });
    };
}


function CreateCtrl($scope, $location, Project) {
}


function EditCtrl($scope, $location, $routeParams, Project) {
    var self = this;

    Project.get({id: $routeParams.projectId}, function(project) {
        self.original = project;
        $scope.project = new Project(self.original);
    });
}

// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('mongolab', ['ngResource']).
    factory('ModuleData', function() {
        var ModuleData = {};

        ModuleData.name = 'message';

        ModuleData.switch = function (newName){
            ModuleData.name = newName;
        };

        return ModuleData;
    }).
    factory('Project', function($resource, ModuleData) {
        var Project = $resource('https://api.mongolab.com/api/1/databases/:module/collections/dictionary/:id',
                {apiKey: 'INhDmBsNG5W7IetIGeGud30HckRoL9Pv', s: '{"name":1}' },
                {
                    update: { method: 'PUT' }
                }
            );

        Project.prototype.update = function(cb) {
            return Project.update({id: this._id.$oid},
                angular.extend({}, this, {_id:undefined}), cb);
        };

        Project.prototype.destroy = function(cb) {
            return Project.remove({id: this._id.$oid}, cb);
        };

        return Project;
    });

