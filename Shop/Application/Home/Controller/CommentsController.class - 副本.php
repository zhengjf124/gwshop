<?php
namespace Home\Controller;
require_once(APP_PATH . 'ApiController.class.php');
use Application\ApiController;


/**
 * 评论接口
 * @author fangdexin
 * @package Home\Controller
 */
class CommentsController extends ApiController
{

    /**
     * 构造函数
     */
    public function __construct() {
        parent::__construct();

    }
     /**
     * ##评论列表接口
     * URI : /Home/Comments/index
     * @param :
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     * _passport  | string   | 必填 |用户票据
     *  offset  |   int    |  选填  |分页开始
     *  limit   |   int    |  选填  |每页几条
     *  type   |   int    |  选填  |默认待评价,1已评价
     *
     * @return
     * name   | type     | description
     * --------|----------|----------------------
     * list     | array   | 订单列表二维数组
     * count    | int     | 订单总数
     *
     * list:
     *  name   | type     | description
     * --------|----------|----------------------
     * id      | int      | 订单id
     * confirm_time   | int     | 完成时间
     * goods    | array    | 商品列表
     *
     * goods :
     * name | type | description
     * -----|------|-----------
     * id   |  int |  商品id
     * goods_name |  string |  商品名称
     * goods_price |  decimal |  商品价格
     * goods_img   |  string |  商品图片
     * goods_num   |  int |  商品数量
     *
     */
    public function index()
    {
        $user  = $this->_checkPassport();//用户必须登入
        $userId = $user['id'];
        
        $type = I('is_comments') ? I('type') : 0;
        $where = ['user_id'=>$userId , 'type'=>$type , 'order_status'=>5];
        
        $offset = I('offset') ? I('offset') : 0;
        $limit = I('limit') ? I('limit')  : 20;
        $count = M('Orders')->where($where)->count();
        $list = M('Orders')->where($where)
                ->field('id,confirm_time,goods')
                ->limit($offset,$limit)->select();
        foreach($list as & $val)
        {
            $val['goods'] = json_decode($val['goods'],true);
        }
        $data = ['list'=>$list,'count'=>$count];
        
        $this->_returnData($data);
    }

    /**
     * ##评论信息接口##
     * URI : /Home/Comments/cont
     * @param :
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     * _passport  | string   | 必填 |用户票据
     * id       | int   | 必填 | 订单id
     *
     * @return
     *  name   | type     | description
     * --------|----------|----------------------
     * id      | int      | 订单id
     * user_id | int      | 判断用的
     * order_status | int | 判断用的
     * goods   | array    | 商品列表  二维数组
     *
     * goods :
     * name | type | description
     * -----|------|-----------
     * id   |  int |  商品id
     * goods_name |  string |  商品名称
     * goods_price |  decimal |  商品价格
     * goods_img   |  string |  商品图片
     * goods_num   |  int |  商品数量
     *
     */
    public function cont()
    {
        $user  = $this->_checkPassport();//用户必须登入
        $userId = $user['id'];
        
        $id = I("id");
        
        $order = M('Order')->where(['id'=>$id])
            ->field('id,goods,user_id,order_status')->select();
        
        
        //判断订单是否正确
        if($order['user_id'] != $userId)
        {
            
            $this->_returnError(20001,'note the order');
            
        }
        
        if($order['status'] !=5)
        {
            $this->_returnError(20002,'unfinished order');
        }
        
        foreach($order as & $val)
        {
            $val['goods'] = json_decode($val['goods'],true);
        }

        $this->_returnData($data);


    }

    
    /**
     * ##提交评价接口
     * URI : /Home/Comments/add
     * @param :
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     * _passport | string  | 必填 |用户票据
     * id        | int    |   必填  | 订单id
     * goods_id  | array  |   必填  | 商品ID数组
     * content   | array  |  必填  | 评价内容数组
     * imgs      | array  |  必填  | 评价图片数组
     * lv_desc   | array  |  必填  | 评价描述分数数组
     * lv_speed  | array  |  必填  | 评价速度分数数组
     * lv_server | array  |  必填  | 评价等级分数数组
     *
     * goods_id :
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * key      | int     |   必填 |商品id
     *
     * content :
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * key      | string  |   选填 |评价内容
     *
     * imgs:
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * imgKey   | array   |   必填 | 图片组
     *
     * imgKey
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * key      | string  |   选填 | 图片
     *
     * lv_desc :
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * key      | int     |   必填 |评价描述分数
     *
     * lv_speed :
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * key      | int     |   必填 |评价速度分数
     *
     * lv_server :
     * name     | type    |   null |description
     * -------- | --------|--------|-----------
     * key      | int     |   必填 |评价服务分数
     *
     *
     * @return
     *  name   | type     | description
     * --------|----------|----------------------
     * status  | int      | 返回1评价成功
     *
     *
     */
    public function add()
    {
        $user = $this->_checkPassport();//用户必须登入
        
        $userId     = $user['id'];
        $userName   = $user['user_name'];
        $email      = $user['email'];
        
        $id = I("id");
        
        $goods_id    = I("goods_id");
        $content     = I("content"); 
        $imgs        = I("imgs");    
        $lv_desc     = I("lv_desc");
        $lv_speed    = I("lv_speed");
        $lv_server   = I("lv_server");
        
        $j = count($goods_id);
        $k = 0;
        
        $record['user_id']   = $userId;
        $record['user_name'] = $userName;
        $record['email']     = $email;
        $record['add_time'] = time();
        
        
        for($i = 0 ; $i < $j ; $i++)
        {
            
            $record['goods_id']  = $goods_id[$i];           //评价商品ID
            $record['content']   = $content[$i];            //评价内容
            $record['imgs']      = json_encode($imgs[$i]);  //评价图片
            $record['lv_desc']   = $lv_desc[$i];            //描述相符
            $record['lv_speed']  = $lv_speed[$i];           //发货速度
            $record['lv_server'] = $lv_server[$i];          //服务态度
            
            if($record['content'])
            {
                M("Comments")->add($record);
                $k++;// k大于0修改订单评论状态
            }
            
        }
        
        if($k > 0)
        {
            $status = M("Order")->where(["id"=>$id])->setField('is_comments',1);
        }
        else
        {
            $this->_returnError(20001,'content is null');
        }
        
        

        $data = ['status'=>$status];
        $this->_returnData($data);
        
    }
    
    /**
     * ##商品详情评价列表接口
     * URI : /Home/Comments/goods_comments
     * @param :
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     *  goodsId |   int    |  必填  |商品ID
     *  offset  |   int    |  选填  |分页开始
     *  limit   |   int    |  选填  |每页几条
     *
     * @return
     * name   | type     | description
     * --------|----------|----------------------
     * list     | array   | 评价列表二维数组
     * count    | int     | 评价总数
     *
     * list:
     *  name   | type     | description
     * --------|----------|----------------------
     * id      | int      | 评价ID
     * add_time| int      | 评价时间
     * content | string   | 评论内容
     * user_name | string  | 评论用户
     * headimgurl | string  | 用户头像
     *
     */
    public function goods_comments(){
        
        $goodsId = I("goodsId");
        $offset = I('offset') ? I('offset') : 0;
        $limit = I('limit') ? I('limit')  : 20;
        
        $where = ['goods_id'=>$goodsId , 'status'=>1];
        
        $count = M('Comments')->where($where)->count();
        $list = M('Comments')->where($where)
                ->field(' id , user_id , user_name , add_time , content ')
                ->limit($offset,$limit)->select();
                
                
        foreach($list as & $val)
        {
            $val['headimgurl'] = M("user")->where(["id"=>$val['user_id']])->getField('headimgurl');
            if(!$val['headimgurl']){
                $val['headimgurl'] = C('site_url').'/Public/weixin/img-tx.jpg';
            }
        }
        $data = ['list'=>$list,'count'=>$count];
        
        $this->_returnData($data);
    }






   
}//end