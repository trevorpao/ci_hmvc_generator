
'use strict';

angular.module('project', ['mongolab']).config(function($routeProvider) {
    $routeProvider.
    when('/', {controller:ListCtrl, templateUrl:'list.html'}).
    when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
    when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    otherwise({redirectTo:'/'});
});


function ListCtrl($scope, Project) {
    $scope.module = "message";
    $scope.projects = Project.query();
}


function CreateCtrl($scope, $location, Project) {
    $scope.save = function() {
        Project.save($scope.project, function(project) {
            $location.path('/edit/' + project._id.$oid);
        });
    };
}


function EditCtrl($scope, $location, $routeParams, Project) {
    var self = this;

    Project.get({id: $routeParams.projectId}, function(project) {
        self.original = project;
        $scope.project = new Project(self.original);
    });

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.project);
    }

    $scope.destroy = function() {
        self.original.destroy(function() {
            $location.path('/list');
        });
    };

    $scope.save = function() {
        $scope.project.update(function() {
            $location.path('/');
        });
    };
}

// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('mongolab', ['ngResource']).
    factory('Project', function($resource) {
      var Project = $resource('https://api.mongolab.com/api/1/databases' +
          '/message/collections/dictionary/:id',
                              { apiKey: 'INhDmBsNG5W7IetIGeGud30HckRoL9Pv', s: '{"name":1}' },
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

