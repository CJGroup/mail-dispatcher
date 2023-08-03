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
 * @api {POST} /list/add 增加新成员
 * @apiVersion 1.0.0
 * @apiName Post AddMemberToList
 * @apiGroup 列表
 * @apiDescription 向列表中新增加成员
 * @apiBody {String} nickname 玩家昵称
 * @apiBody {String} mail 玩家邮件地址
 * @apiBody {String} [serverID] 服务器ID
 * @apiUse SuccessBase
 * @apiSuccess {Object} book 用户预约信息
 * @apiSuccess {Number} book.pos 当前用户在列表中的排名
 * @apiSuccess {Number} book.total 当前列表中的用户总数
 * @apiUse ErrorBase
 * @apiErrorExample {json} 403 邮件已存在
 * HTTP/1.1 403 Forbidden
 * {
 *    "code": 53,
 *    "message": "This Email is already in our list!"
 * }
 * @apiErrorExample {json} 400 缺失参数
 * HTTP/1.1 400 Bad Request
 * {
 *    "code": 40,
 *    "message": "Missing Params!"
 * }
 */
/**
 * @api {POST} /list/add/batch 批量添加
 * @apiVersion 1.0.0
 * @apiName Post BatchAdd
 * @apiGroup 列表
 * @apiDescription 向列表中批量添加成员
 * @apiBody {Object[]} list 批量添加的成员列表
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 数据对象
 * @apiSuccess {Object[]} data.bookList 按照顺序返回的预订信息列表
 * @apiSuccess {Number} data.bookList.pos 当前用户在列表中的排名
 * @apiSuccess {Number} data.bookList.total 当前列表中的用户总数
 * @apiUse ErrorBase
 * @apiErrorExample {json} 403 邮件已存在
 * HTTP/1.1 403 Forbidden
 * {
 *    "code": 53,
 *    "message": "This Email is already in our list!"
 * }
 * @apiErrorExample {json} 400 缺失参数
 * HTTP/1.1 400 Bad Request
 * {
 *    "code": 40,
 *    "message": "Missing Params!"
 * }
 */
/**
 * @api {GET} /list/get 获取列表
 * @apiVersion 1.0.0
 * @apiName Get List
 * @apiDescription 获取当前预约成员列表
 * @apiGroup 列表
 * @apiPermission 管理员
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 数据对象
 * @apiSuccess {Number} data.count 当前总用户数
 * @apiSuccess {Object[]} data.list 预约成员列表本体
 * @apiBody {String} data.list.nickname 玩家昵称
 * @apiBody {String} data.list.mail 玩家邮件地址
 * @apiBody {String} [data.list.serverID] 服务器ID
 */
/**
 * @api {GET} /list/get/self 获取预约信息
 * @apiVersion 1.0.0
 * @apiName Get SelfPositionInList
 * @apiDescription 获取提供的用户在列表中的位置
 * @apiGroup 列表
 * @apiQuery {String} nickname 用户昵称
 * @apiQuery {String} mail 用户邮箱
 * @apiQUery {String} [serverID] 用户服务器ID
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 数据对象
 * @apiSuccess {Number} data.pos 当前用户在列表中的排名
 * @apiSuccess {Number} data.total 当前列表中的用户总数
 * @apiUse ErrorBase
 * @apiErrorExample {json} 404 未找到用户
 * HTTP/1.1 404 Not Found
 * {
 *    "code": 64,
 *    "message": "No this player in the list!"
 * }
 */
/**
 * @api {POST} /list/remove 移除成员
 * @apiVersion 1.0.0
 * @apiName Post RemoveListNumber
 * @apiDescription 从列表中移除成员
 * @apiGroup 列表
 * @apiPermission 管理员
 * @apiBody {String} nickname 玩家昵称
 * @apiBody {String} mail 玩家邮件地址
 * @apiBody {String} [serverID] 服务器ID
 * @apiUse ErrorBase
 * @apiUse SuccessBase
 */
/**
 * @api {POST} /send 直接发送邮件
 * @apiVersion 1.0.0
 * @apiName Post SendEmail
 * @apiDescription 直接向目标邮箱发送邮件
 * @apiGroup 直接发送
 * @apiPermission 管理员
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 */
/**
 * @api {POST} /send/batch 直接批量发送邮件
 * @apiVersion 1.0.0
 * @apiName Post BatchSendEmail
 * @apiGroup 直接发送
 * @apiPermission 管理员
 * @apiDescription 批量直接向目标邮箱中发送邮件
 * @apiBody {Object[]} list 批量发送的邮箱列表
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 */
