app.service('LoadSceneService', ['RequestService', 'PrimitiveObjectService', function (RequestService, PrimitiveObjectService) {

    var _this = this;

    this.resolve = function(res, callback) {

        var scene;
        if(res.data.length){
            scene = new THREE.Scene();
            var objectToAdd = {};
            res.data.forEach(function(sceneObject) {
                var id = sceneObject.id;
                if(sceneObject.name != null) {
                    objectToAdd = PrimitiveObjectService.getObject(sceneObject.objecttype, sceneObject);
                    objectToAdd.custom = {
                        id: id
                    };
                    scene.add(objectToAdd);
                }
            });
        }

        callback(scene);
    };

    this.getScene = function(sceneId, isTemplateScene, callback) {
        RequestService.post('sceneobjects/get', {scene_id: sceneId, is_templatescene: isTemplateScene}, function(res) {
            _this.resolve(res, callback);
        }, function(error) {
            console.error(error);
        });
    }

}]);