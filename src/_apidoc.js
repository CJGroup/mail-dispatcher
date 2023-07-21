/**
 * @apiDefine SuccessBase
 * @apiSuccess {Number} code 响应代码，默认为0
 * @apiSuccess {Number} message 响应消息，默认为success
 */
/**
 * @apiDefine ErrorBase
 * @apiError {Number} code 响应代码
 * @apiError {String} message 响应消息
 */
/**
 * @api {POST} /list/add 增加新成员
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
 * @apiName Get List
 * @apiDescription 获取当前预约成员列表
 * @apiGroup 列表
 * @apiPermission admin
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
 * @apiName Post RemoveListNumber
 * @apiDescription 从列表中移除成员
 * @apiGroup 列表
 * @apiPermission admin
 * @apiBody {String} nickname 玩家昵称
 * @apiBody {String} mail 玩家邮件地址
 * @apiBody {String} [serverID] 服务器ID
 * @apiUse SuccessBase
 * @apiUSe ErrorBase
 */
/**
 * @api {GET} /list/send/all 向所有成员发送邮件
 * @apiName Get SendEmailToAll
 * @apiDescription 向列表中的所有人发送邮件
 * @apiGroup 列表
 * @apiPermission admin
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 * @apiErrorExample {json} 404 列表内没有成员
 * HTTP/1.1 404 Not Found
 * {
 *    "code": 95,
 *    "message": "No players on our lists!"
 * }
 */
/**
 * @api {POST} /list/send 向指定数目成员发送邮件
 * @apiName Post SendEmailToNumberedMember
 * @apiDescription 向指定数目的列表成员（从前往后）发送邮件
 * @apiGroup 列表
 * @apiPermission admin
 * @apiBody {Number} number 要发送的成员数量
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 * @apiErrorExample {json} 500 数目过大
 * HTTP/1.1 500 Internal Server Error
 * {
 *    "code": 101,
 *    "message": "the number you provided is larger than the players on our list!"
 * }
 */
/**
 * @api {POST} /send 直接发送邮件
 * @apiName Post SendEmail
 * @apiDescription 直接向目标邮箱发送邮件
 * @apiGroup 直接发送
 * @apiPermission admin
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 */
/**
 * @api {POST} /list/add/batch 直接批量发送邮件
 * @apiName Post BatchSendEmail
 * @apiGroup 直接发送
 * @apiDescription 批量直接向目标邮箱中发送邮件
 * @apiBody {Object[]} list 批量发送的邮箱列表
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 */
/**
 * @api {GET} /feishu/redirect OAuth回调
 * @apiName Get FeishuCallback
 * @apiGroup 飞书
 * @apiDescription 飞书OAuth2登录回调API
 * @apiQuery {String} code 返回的code
 */
