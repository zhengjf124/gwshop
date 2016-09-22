/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50547
Source Host           : localhost:3306
Source Database       : gwshop

Target Server Type    : MYSQL
Target Server Version : 50547
File Encoding         : 65001

Date: 2016-06-22 18:37:49
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for gwshop_admin
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_admin`;
CREATE TABLE `gwshop_admin` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '管理员编号',
  `user_name` varchar(60) NOT NULL COMMENT '用户名',
  `email` varchar(60) NOT NULL COMMENT '邮箱',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `add_time` int(11) NOT NULL DEFAULT '0' COMMENT '添加时间',
  `last_login` int(11) NOT NULL DEFAULT '0' COMMENT '最后一次登录时间',
  `last_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录ip',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户状态：0正常，1禁用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='管理员信息';

-- ----------------------------
-- Records of gwshop_admin
-- ----------------------------
INSERT INTO `gwshop_admin` VALUES ('1', 'admin', '', 'admin', '0', '0', '0', '1');

-- ----------------------------
-- Table structure for gwshop_article
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_article`;
CREATE TABLE `gwshop_article` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
  `title` varchar(150) NOT NULL COMMENT '文章题目',
  `content` longtext NOT NULL COMMENT '文章内容',
  `author` varchar(30) NOT NULL COMMENT '文章作者',
  `keywords` varchar(255) NOT NULL COMMENT '文章的关键字',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '文章添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章内容表';

-- ----------------------------
-- Records of gwshop_article
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_attachment
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_attachment`;
CREATE TABLE `gwshop_attachment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '附件编号',
  `savepath` varchar(100) NOT NULL DEFAULT '' COMMENT '服务器保存路径:路径控制下长度',
  `savename` varchar(100) NOT NULL DEFAULT '' COMMENT '实际保存文件名:随机生成固定固定长度的字符串+后缀',
  `oldname` varchar(255) NOT NULL DEFAULT '' COMMENT '原文件名',
  `extension` varchar(12) NOT NULL DEFAULT '' COMMENT '文件后缀:jpep,gif,png等',
  `filesize` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '文件大小',
  `filetype` varchar(60) NOT NULL DEFAULT '' COMMENT '文件类型',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '上传时间',
  `update_time` int(11) NOT NULL DEFAULT '0' COMMENT '更新时间',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '附件状态:0正常,1待审核',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='附件信息';

-- ----------------------------
-- Records of gwshop_attachment
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_cart
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_cart`;
CREATE TABLE `gwshop_cart` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户登录id，取自session，',
  `session_id` char(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '登录的sessionid，如果该用户退出，该sessionid对应的购物车中的所有记录都将被删除',
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '商品编号',
  `goods_sn` varchar(60) NOT NULL COMMENT '商品货号',
  `goods_name` varchar(120) NOT NULL COMMENT '商品名称',
  `market_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '商品原价',
  `goods_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品折扣价',
  `goods_number` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '购买数量',
  `rec_type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '购物车商品类型，0，普通；1，团够',
  `is_gift` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '是否是赠品，0 非赠品',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='购物车信息记录';

-- ----------------------------
-- Records of gwshop_cart
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_comments
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_comments`;
CREATE TABLE `gwshop_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '评论编号',
  `goods_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '商品编号',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `user_name` varchar(60) NOT NULL COMMENT '评论用户名:此字段用于数据冗余',
  `email` varchar(60) NOT NULL COMMENT 'email地址:此字段用于数据冗余',
  `content` text NOT NULL COMMENT '评论内容',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '评论时间',
  `ip_address` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户ip',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '审核状态，1,已审核；0,未审核',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '评论的父节点:用于盖楼',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品的评论列表';

-- ----------------------------
-- Records of gwshop_comments
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_coupons
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_coupons`;
CREATE TABLE `gwshop_coupons` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '优惠券编号',
  `title` varchar(20) NOT NULL DEFAULT '' COMMENT '优惠券标题',
  `contexts` varchar(200) NOT NULL DEFAULT '' COMMENT '优惠券内容简介',
  `coupons_type_id` smallint(8) unsigned NOT NULL COMMENT '优惠券类型编号',
  `start_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '开始时间',
  `end_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '结束时间',
  `create_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '有效状态0：有效,1：过期',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='优惠券基础信息';

-- ----------------------------
-- Records of gwshop_coupons
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_coupons_log
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_coupons_log`;
CREATE TABLE `gwshop_coupons_log` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '优惠券记录编号',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `coupons_id` mediumint(8) unsigned NOT NULL COMMENT '优惠券编号',
  `order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '订单编号',
  `usage_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `coupons_id` (`coupons_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='优惠券使用记录';

-- ----------------------------
-- Records of gwshop_coupons_log
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_coupons_type
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_coupons_type`;
CREATE TABLE `gwshop_coupons_type` (
  `id` smallint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '优惠券类型编号',
  `title` varchar(20) NOT NULL DEFAULT '' COMMENT '类型名称',
  `contexts` varchar(200) NOT NULL DEFAULT '' COMMENT '优惠券使用范围',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '有效状态0：有效,1：过期',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='优惠券类型';

-- ----------------------------
-- Records of gwshop_coupons_type
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_credit
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_credit`;
CREATE TABLE `gwshop_credit` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '积分编号',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `total_credit` mediumint(8) NOT NULL COMMENT '总积分',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户积分表';

-- ----------------------------
-- Records of gwshop_credit
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_credit_log
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_credit_log`;
CREATE TABLE `gwshop_credit_log` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '积分编号',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `credit_type` smallint(8) NOT NULL COMMENT '积分类型:gwshop_credit_rule:id',
  `credit` mediumint(8) NOT NULL COMMENT '本次积分',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '获取时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户积分获取记录';

-- ----------------------------
-- Records of gwshop_credit_log
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_credit_rule
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_credit_rule`;
CREATE TABLE `gwshop_credit_rule` (
  `id` smallint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '规则编号',
  `rule_name` varchar(20) NOT NULL COMMENT '规则名称',
  `cycle_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '奖励周期0:一次;1:每天;2:整点;3:间隔分钟;4:不限;',
  `cycle_time` int(10) NOT NULL DEFAULT '0' COMMENT '间隔时间',
  `reward_num` tinyint(1) NOT NULL DEFAULT '1' COMMENT '奖励次数',
  `norepeat` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否去重1：去重;0：不去重',
  `credit` smallint(8) NOT NULL COMMENT '本条规则积分',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户积分规则';

-- ----------------------------
-- Records of gwshop_credit_rule
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_goods
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_goods`;
CREATE TABLE `gwshop_goods` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '商品编号',
  `goods_sn` varchar(60) NOT NULL COMMENT '商品货号',
  `goods_name` varchar(120) NOT NULL COMMENT '商品名称',
  `goods_title` varchar(120) NOT NULL COMMENT '商品副标题',
  `goods_type_id` smallint(8) NOT NULL COMMENT '商品类型编号',
  `click_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品点击数',
  `market_price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '商品原价',
  `goods_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品折扣价',
  `goods_brief` varchar(255) NOT NULL COMMENT '商品的简短描述',
  `goods_desc` text NOT NULL COMMENT '商品的详细描述',
  `goods_thumb` varchar(255) NOT NULL COMMENT '商品在前台显示的微缩图片，如在分类筛选时显示的小图片',
  `goods_img` varchar(255) NOT NULL COMMENT '商品的实际大小图片，如进入该商品页时介绍商品属性所显示的大图片',
  `original_img` varchar(255) NOT NULL COMMENT '应该是上传的商品的原始图片',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品的添加时间',
  `sort_order` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '应该是商品的显示顺序，不过该版程序中没实现该功能',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '商品是否已经删除，0，否；1，已删除',
  `is_best` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否是精品；0，否；1，是',
  `is_new` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否是新品；0，否；1，是',
  `is_hot` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否热销，0，否；1，是',
  `is_promote` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否特价促销；0，否；1，是',
  `last_update` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最近一次更新商品配置的时间',
  `goods_sales` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品销量',
  PRIMARY KEY (`id`),
  KEY `goods_sn` (`goods_sn`),
  KEY `goods_type_id` (`goods_type_id`),
  KEY `last_update` (`last_update`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='商品信息';

-- ----------------------------
-- Records of gwshop_goods
-- ----------------------------
INSERT INTO `gwshop_goods` VALUES ('1', '', '猪蹄500g', '猪蹄500g', '0', '0', '25.00', '20.00', '上好猪蹄便宜拍', '猪蹄500g猪蹄500g猪蹄500g猪蹄500g', '', '', '', '0', '0', '0', '0', '0', '0', '0', '0', '0');
INSERT INTO `gwshop_goods` VALUES ('2', '', '猪头500g', '', '0', '0', '25.00', '20.00', '', '', '', '', '', '0', '0', '0', '0', '0', '0', '0', '0', '0');
INSERT INTO `gwshop_goods` VALUES ('3', '', '猪肚500g', '', '0', '0', '25.00', '20.00', '', '', '', '', '', '0', '0', '0', '0', '0', '0', '0', '0', '0');

-- ----------------------------
-- Table structure for gwshop_goods_favorite
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_goods_favorite`;
CREATE TABLE `gwshop_goods_favorite` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '收藏编号',
  `user_id` mediumint(8) NOT NULL COMMENT '用户编号',
  `goods_id` mediumint(8) NOT NULL COMMENT '商品编号',
  `add_time` int(11) NOT NULL DEFAULT '0' COMMENT '收藏时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户商品收藏记录';

-- ----------------------------
-- Records of gwshop_goods_favorite
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_goods_type
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_goods_type`;
CREATE TABLE `gwshop_goods_type` (
  `id` smallint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '商品类型编号',
  `type_name` varchar(50) NOT NULL COMMENT '类型名称',
  `type_desc` varchar(50) NOT NULL COMMENT '类型描述',
  `parent_id` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '该分类的父id',
  `sort_order` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '分类排序编号',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '类型状态:0可用,1不可用',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商品类型';

-- ----------------------------
-- Records of gwshop_goods_type
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_goods_visit
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_goods_visit`;
CREATE TABLE `gwshop_goods_visit` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '浏览编号',
  `user_id` mediumint(8) NOT NULL COMMENT '用户编号',
  `goods_id` mediumint(8) NOT NULL COMMENT '商品编号',
  `add_time` int(11) NOT NULL DEFAULT '0' COMMENT '浏览时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户商品浏览记录';

-- ----------------------------
-- Records of gwshop_goods_visit
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_loggings
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_loggings`;
CREATE TABLE `gwshop_loggings` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '日志编号',
  `action` varchar(60) NOT NULL COMMENT '操作类型:添加用户,创建订单,支付订单等',
  `user_id` mediumint(8) NOT NULL COMMENT '用户编号',
  `content` longtext NOT NULL COMMENT '操作内容:详细操作内容序列化后存储',
  `log_time` int(11) NOT NULL DEFAULT '0' COMMENT '操作时间',
  `ip_address` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '操作者ip地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='操作日志';

-- ----------------------------
-- Records of gwshop_loggings
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_messages
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_messages`;
CREATE TABLE `gwshop_messages` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '站内信编号',
  `msg_type` varchar(60) NOT NULL COMMENT '站内信类型:促销信息,订单信息等',
  `title` varchar(60) NOT NULL COMMENT '站内信标题',
  `content` longtext NOT NULL COMMENT '标题内容',
  `msg_from` mediumint(8) NOT NULL COMMENT '发送者编号',
  `msg_to` mediumint(8) NOT NULL DEFAULT '0' COMMENT '接受者编号',
  `send_time` int(11) NOT NULL DEFAULT '0' COMMENT '发送时间',
  `read_time` int(11) NOT NULL DEFAULT '0' COMMENT '读取时间',
  `readed` tinyint(1) NOT NULL DEFAULT '0' COMMENT '留言是否阅读，1，已阅读；0，未阅读',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='站内信';

-- ----------------------------
-- Records of gwshop_messages
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_orders
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_orders`;
CREATE TABLE `gwshop_orders` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '订单编号',
  `order_sn` varchar(20) NOT NULL COMMENT '订单号，唯一',
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `order_status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '订单状态。0-待付款；1-待发货；2-已取消；3-待收货；4-待评价；5-完成',
  `shipping_status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '商品配送情况，0，未发货；1，已发货；2，已收货；3，备货中',
  `pay_status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '支付状态；0，未付款；1，付款中；2，已付款',
  `user_address` varchar(225) NOT NULL COMMENT '收货地址',
  `user_address_id` mediumint(8) unsigned NOT NULL COMMENT '收货地址编号',
  `postscript` varchar(255) NOT NULL COMMENT '订单附言，由用户提交订单前填写',
  `pay_id` tinyint(3) NOT NULL DEFAULT '0' COMMENT '支付方式编号',
  `pay_name` varchar(120) NOT NULL COMMENT '支付方式名称',
  `inv_payee` varchar(120) NOT NULL COMMENT '发票抬头',
  `inv_content` varchar(120) NOT NULL COMMENT '发票内容',
  `tax` decimal(10,2) NOT NULL COMMENT '发票税额',
  `goods_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总金额',
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '配送费用',
  `insure_fee` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '保价费用',
  `pay_fee` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '支付费用',
  `money_paid` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '已付款金额',
  `order_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '应付款金额',
  `referer` varchar(255) NOT NULL COMMENT '订单的来源页面',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '订单生成时间',
  `confirm_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '订单确认时间',
  `pay_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '订单支付时间',
  `goods` varchar(255) DEFAULT NULL COMMENT '商品列表信息 json格式',
  `shipping_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '订单配送时间',
  `invoice_no` varchar(50) NOT NULL COMMENT '发货单号',
  `extension_code` varchar(30) NOT NULL COMMENT '通过活动购买的商品的代号；GROUP_BUY是团购；AUCTION，是拍卖；正常普通产品该处为空',
  `extension_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '通过活动购买的物品的id',
  `pay_note` varchar(255) NOT NULL COMMENT '付款备注',
  `is_separate` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0，未分成或等待分成；1，已分成；2，取消分成；',
  `parent_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '推荐分成的用户编号',
  `discount` decimal(10,2) NOT NULL COMMENT '折扣金额',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_sn` (`order_sn`),
  KEY `user_id` (`user_id`),
  KEY `order_status` (`order_status`),
  KEY `shipping_status` (`shipping_status`),
  KEY `pay_status` (`pay_status`),
  KEY `pay_id` (`pay_id`),
  KEY `extension_code` (`extension_code`,`extension_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单信息';

-- ----------------------------
-- Records of gwshop_orders
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_payment
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_payment`;
CREATE TABLE `gwshop_payment` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT COMMENT '支付方式编号',
  `pay_code` varchar(20) NOT NULL COMMENT '支付方式的英文缩写',
  `pay_name` varchar(120) NOT NULL COMMENT '支付方式名称',
  `pay_fee` varchar(10) NOT NULL DEFAULT '0' COMMENT '支付费用',
  `pay_desc` text NOT NULL COMMENT '支付方式描述',
  `pay_order` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '支付方式在页面的显示顺序',
  `pay_config` text NOT NULL COMMENT '支付方式的配置信息，包括商户号和密钥什么的',
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否可用，0，否；1，是',
  `is_cod` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否货到付款，0，否；1，是',
  `is_online` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否在线支付，0，否；1，是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `pay_code` (`pay_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='支付方式配置信息';

-- ----------------------------
-- Records of gwshop_payment
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_pay_log
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_pay_log`;
CREATE TABLE `gwshop_pay_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '支付记录编号',
  `order_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '所支付订单编号',
  `order_amount` decimal(10,2) unsigned NOT NULL COMMENT '支付金额',
  `order_type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '支付类型；0，订单支付；1，会员预付款支付',
  `is_paid` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否已支付，0，否；1，是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单支付记录';

-- ----------------------------
-- Records of gwshop_pay_log
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_sysinfo
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_sysinfo`;
CREATE TABLE `gwshop_sysinfo` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '系统设置参数',
  `title` varchar(120) NOT NULL COMMENT '标签名称',
  `key_name` varchar(120) NOT NULL COMMENT '键名称',
  `key_value` text NOT NULL COMMENT '键值',
  `sort` tinyint(3) NOT NULL DEFAULT '0' COMMENT '排序',
  `group` varchar(80) NOT NULL DEFAULT '' COMMENT '数据分组:sys,mail...',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态，0-正常，1-禁用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`),
  KEY `group_status` (`group`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统基础信息';

-- ----------------------------
-- Records of gwshop_sysinfo
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_user
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_user`;
CREATE TABLE `gwshop_user` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `email` varchar(60) NOT NULL COMMENT '会员邮箱',
  `user_name` varchar(60) NOT NULL COMMENT '用户名',
  `nick_name` varchar(60) NOT NULL DEFAULT '' COMMENT '昵称',
  `headimgurl` varchar(100) NOT NULL DEFAULT '' COMMENT '用户头像',
  `password` varchar(32) NOT NULL COMMENT '用户密码',
  `sex` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '性别，0，保密；1，男；2，女',
  `birthday` date NOT NULL DEFAULT '0000-00-00' COMMENT '生日日期',
  `reg_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '注册时间',
  `last_login` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录时间',
  `last_ip` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次登录ip',
  `login_count` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '登录次数',
  `parent_id` mediumint(9) NOT NULL DEFAULT '0' COMMENT '推荐人会员id，',
  `qq` varchar(20) NOT NULL COMMENT 'qq号',
  `mobile_phone` varchar(20) NOT NULL COMMENT '手机',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户状态0，正常，1，锁定',
  `wx_uid` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '微信用户编号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `email` (`email`),
  KEY `parent_id` (`parent_id`),
  KEY `wx_uid` (`wx_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of gwshop_user
-- ----------------------------
INSERT INTO `gwshop_user` VALUES ('1', '', '18650306103', '', '', 'e10adc3949ba59abbe56e057f20f883e', '0', '0000-00-00', '0', '0', '0', '0', '0', '', '', '0', '0');
INSERT INTO `gwshop_user` VALUES ('2', '', 'wubuze', '', '', 'e10adc3949ba59abbe56e057f20f883e', '0', '0000-00-00', '0', '0', '0', '0', '0', '', '', '0', '0');

-- ----------------------------
-- Table structure for gwshop_user_address
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_user_address`;
CREATE TABLE `gwshop_user_address` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '收货编号',
  `address_name` varchar(50) NOT NULL COMMENT '收货名称:办公地址,家庭地址等',
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `consignee` varchar(60) NOT NULL COMMENT '收货人的名字',
  `email` varchar(60) NOT NULL COMMENT '收货人的email',
  `country` smallint(5) NOT NULL DEFAULT '0' COMMENT '收货人的国家',
  `province` smallint(5) NOT NULL DEFAULT '0' COMMENT '收货人的省份',
  `city` smallint(5) NOT NULL DEFAULT '0' COMMENT '收货人的城市',
  `district` smallint(5) NOT NULL DEFAULT '0' COMMENT '收货人的地区',
  `address` varchar(120) NOT NULL COMMENT '收货人的详细地址',
  `zipcode` varchar(60) NOT NULL COMMENT '收货人的邮编',
  `tel` varchar(60) NOT NULL COMMENT '收货人的电话',
  `mobile` varchar(60) NOT NULL COMMENT '收货人的手机',
  `sign_building` varchar(120) NOT NULL COMMENT '收货地址的标志性建筑名',
  `best_time` varchar(120) NOT NULL COMMENT '收货人的最佳收货时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='收货人的信息表';

-- ----------------------------
-- Records of gwshop_user_address
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_user_log
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_user_log`;
CREATE TABLE `gwshop_user_log` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL DEFAULT '0' COMMENT '用户编号',
  `user_name` varchar(60) NOT NULL COMMENT '用户名',
  `error_counts` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '登录失败次数',
  `last_login` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后一次尝试时间',
  PRIMARY KEY (`id`),
  KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户登录错误记录';

-- ----------------------------
-- Records of gwshop_user_log
-- ----------------------------

-- ----------------------------
-- Table structure for gwshop_user_passport
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_user_passport`;
CREATE TABLE `gwshop_user_passport` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户票据',
  `passport` varchar(32) DEFAULT NULL COMMENT '用户票据',
  `user_id` mediumint(8) unsigned DEFAULT '0' COMMENT '用户登录id',
  `add_time` int(10) unsigned DEFAULT '0' COMMENT '添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of gwshop_user_passport
-- ----------------------------
INSERT INTO `gwshop_user_passport` VALUES ('3', 'c692f04c9697bb4b14939a29499e997b', '1', '1466391306');
INSERT INTO `gwshop_user_passport` VALUES ('4', '7057cb47f57689b4a7b86f570d2cec6f', '2', '1466391787');

-- ----------------------------
-- Table structure for gwshop_weixin_user
-- ----------------------------
DROP TABLE IF EXISTS `gwshop_weixin_user`;
CREATE TABLE `gwshop_weixin_user` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `nickname` varchar(60) NOT NULL COMMENT '用户昵称',
  `subscribe` int(9) NOT NULL DEFAULT '0' COMMENT '用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息',
  `openid` varchar(20) NOT NULL COMMENT '用户的标识，对当前公众号唯一',
  `city` varchar(20) NOT NULL COMMENT '用户所在城市',
  `country` varchar(20) NOT NULL COMMENT '用户所在国家',
  `province` varchar(20) NOT NULL COMMENT '用户所在省份',
  `language` varchar(20) NOT NULL COMMENT '用户的语言，简体中文为zh_CN',
  `headimgurl` varchar(100) NOT NULL COMMENT '用户头像',
  `subscribe_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间',
  `unionid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。',
  `remark` varchar(200) NOT NULL COMMENT '公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注',
  `groupid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户所在的分组ID（兼容旧的用户分组接口）',
  `tagid_list` varchar(20) NOT NULL COMMENT '用户被打上的标签ID列表',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='微信用户表';

-- ----------------------------
-- Records of gwshop_weixin_user
-- ----------------------------
