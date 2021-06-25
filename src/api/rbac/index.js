const RbacController = require('./RbacController');

const rbac = new RbacController();
rbac.initialize();

module.exports = rbac;
