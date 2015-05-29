app.directive('editorObject', ['$rootScope', 'EditorService', function ($rootScope, EditorService) {
    return {
        restrict: 'E',
        templateUrl: 'partials/editor/editorObject.html',
        replace: true,
        link: function(scope, elem, attrs) {

            scope.$on('getEditorObject', function(mass, callback) {
                callback(scope.item);
            });

            $rootScope.$on('objectSelected', function(event, object) {
                if(scope.item.id == object.id){
                    scope.isActive = true;
                    if(!scope.item.detailsOpen && !elem.hasClass('active')) {
                        scope.item.detailsOpen = true;
                    }
                }else{
                    scope.isActive = false;
                }

                //avoid collision with angulars digest cycle
                if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
                    scope.$apply();
                }
            });

            scope.setActive = function() {
                if(scope.isActive){
                    scope.item.detailsOpen = !scope.item.detailsOpen;
                }
                $rootScope.$emit('objectSelected', scope.item);
            };

            scope.remove = function(object) {
                EditorService.remove(object);
            };

        }
    };
}]);