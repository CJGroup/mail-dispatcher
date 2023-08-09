/**
 * @apiDefine SuccessBase
 * @apiSuccess {Number} code 响应代码，默认为0
 * @apiSuccess {String} message 响应消息，默认为success
 */
/**
 * @apiDefine ErrorBase
 * @apiError {Number} code 响应代码
 * @apiError {String} message 响应消息
 */
/**
 * @api {GET} /user/list/get 获取用户列表
 * @apiName Get UserList
 * @apiDescription 获取当前系统内已经注册的所有用户的信息
 * @apiGroup 用户管理
 * @apiPermission 超级管理员
 * @apiVersion 1.0.0
 * @apiUse SuccessBase
 * @apiSuccess {Object[]} list 获取的用户列表
 * @apiSuccess {String} list.name 用户名
 * @apiSuccess {String} list.openID 用户的OpenID(不应该展示)
 * @apiSuccess {String} list.unionID 用户的UnionID(不应该展示)
 * @apiSuccess {String} list.permission 用户的权限等级（1为普通用户，2为管理员，3为超级管理员）
 * @apiUse ErrorBase
 */