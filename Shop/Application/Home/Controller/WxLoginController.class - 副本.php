<?php
namespace Home\Controller;
require_once(APP_PATH . 'ApiController.class.php');
use Application\ApiController;

/**
 * 微信用户授权
 * @author wubuze
 * @package Home\Controller
 */
class WxLoginController extends ApiController
{ // 接口必须继承这个控制器

    /**
     * 微信浏览器用户授权获取票据接口 \n
     * URI : /Home/WxLogin/index
     * @param :
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     *  -       | -        | -     |不需要
     *
     * @return
     *  name   | type     | description
     * --------|----------|----------------------
     * passport| string   | 用户票据
     *
     */
    public function index()
    {
        $agent = $_SERVER['HTTP_USER_AGENT'];

        if(!strpos($agent,"icroMessenger")) {//微信浏览器
            $this->_returnError('10000','请使用微信浏览器');
        }

        $passport = $this->wx_oauth();
       // $passport = $this->_createPassport($user);
        $data = [
            'passport' => $passport
        ];
        $this->_returnData($data);



    }

    /**
     * 微信授权
     */
    public function wx_oauth(){
        $code= I('code');
        //$wecha_id=session('wecha_id');
        //网页授权获取用户信息
        $token		= 'ogvaam1417750255';
        //$token		= C('site_token');
        //$app=M("diymen_set")->where(array('token'=>$token))->find();
        $app['appid'] = 'wxdd84170ac0f7e52e';//校友君
        $app['appsecret'] ='b5387e34198a4f0b3703402ba1cb6d85';
        //print_r($app);exit;
        if(!$code){
            $uri='http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];//当前页面完整url
            $uri=urlencode($uri);
            //https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect
            $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$app['appid']."&redirect_uri=".$uri."&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
            header("Location: ".$url); exit;
        }else{//网页授权第二步 使用code换取openid
            $appid=$app['appid'];
            $secret=$app['appsecret'];
            $url2="https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$secret."&code=".$code."&grant_type=authorization_code";

            $info=$this->_curlGet($url2);
            $info=json_decode($info,true);



            //保存
            $dbUser = M("User");
            $user=$dbUser->field('id,openid')->where(array('openid'=>$info['openid']))->find();
            if(!$user){
                $data_s['openid']=$info['openid'];
                $data['wx_uid'] = 1;  //微信用户
                $data_s['reg_time']=time();
                $data['user_name'] = "wx".time().mt_rand(100,999);
                //$db_weixinUser->create($data);

                $dbUser->data($data_s)->add();
                $user=$dbUser->field('id,openid')->where(array('openid'=>$info['openid']))->find();

            }

           // return $info['openid'];

            $passport = $this->_createPassport($user);


            $data = [
                'passport' => $passport,
            ];
            $this->_returnData($data);



        }



    }








}//end