app.service('SessionService', ['USER_ROLES', '$crypto', '$rootScope', function (USER_ROLES, $crypto, $rootScope) {

    this.token = null;
    this.nick = null;
    this.email = null;
    this.userRole = USER_ROLES.guest;
    this.profileImage = null;

    var _this = this;

    this.create = function (token, nick, email, userRole, profileImage) {
        this.token = token;
        this.nick = nick;
        this.email = email;
        this.userRole = userRole;
        this.profileImage = profileImage;

        this.setLocalCredentials();
    };

    this.destroy = function () {
        this.token = null;
        this.nick = null;
        this.email = null;
        this.userRole = USER_ROLES.guest;

        this.removeLocalCredentials();
    };

    this.getUser = function () {
        return {
            token: this.token,
            nick: this.nick,
            email: this.email,
            userRole: this.userRole,
            profileImage: this.profileImage
        }
    };

    this.isAdmin = function () {
        return _this.userRole == USER_ROLES.admin;
    };

    this.getRole = function () {
        return this.userRole;
    };

    this.renewLocalCredentials = function(data) {
        console.log(data);
        this.token = data.token || this.token;
        this.nick = data.nick || this.nick;
        this.email = data.email || this.email;
        this.userRole = data.user_role || this.userRole;
        this.profileImage = data.profile_image || this.profileImage;

        this.removeLocalCredentials();
        this.setLocalCredentials();
    };

    this.setLocalCredentials = function () {
        var userData = JSON.stringify(this.getUser());

        var encrypted = $crypto.encrypt(userData, '360crd');
        localStorage.setItem('blick-ls', encrypted);
    };

    this.getLocalCredentials = function () {
        var encrypted = localStorage.getItem('blick-ls');

        if(!encrypted) {
            return false;
        }

        var decrypted = $crypto.decrypt(encrypted, '360crd');
        return JSON.parse(decrypted);
    };

    this.removeLocalCredentials = function () {
        localStorage.removeItem('blick-ls');
    };

    this.reloadLocalCredentials = function () {
        var localCredentials = this.getLocalCredentials();

        if(localCredentials) {
            this.create(localCredentials.token, localCredentials.nick, localCredentials.email, localCredentials.userRole, localCredentials.profileImage);
        }
    };

    $rootScope.$on('updatedUserImage', (function(event, data) {
        this.profileImage = data.profile_image;
        console.log(this.profileImage);
        this.renewLocalCredentials(data);
    }).bind(this));

    return this;
}]);