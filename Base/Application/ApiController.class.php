<?php
namespace Application;

class ApiController extends \Think\Controller
{
    protected $_app = '';

    protected $_platform = '';

    public function __construct() {
        header("Access-Control-Allow-Origin: *");
        if (I('_app')) {
            $this->_app = I('_app');
        } else {
           // $this->_returnError('10000', '_app is null');
        }
        if (I('_platform')) {
            $this->_platform = I('_platform');
        } else {
           // $this->_returnError('10000', '_platform is null');
        }

    }

    /**
     * 用户凭证判断
     */
//    public function _passport() {
//        if (I('_passport')) {
//            //判断票据是否有效
//            $passport = I("_passport");
//            $res = M('User')->where(array('id'=>$passport))->find();
//            if($res){
//                return $res;
//            }else{
//                $this->_returnError('20000', '_passport is error');
//            }
//        } else {
//            $this->_returnError('20000', '_passport is null');
//        }
//    }

    protected function _checkPassport() {
        $passport = I('_passport');

        $res = M('UserPassport')->where(['passport' => $passport])->find();
        if($res){
            $userInfo = M('User')->where(['id' => $res['user_id']])->find();
            if($userInfo){
                return $userInfo;
            }
        }

        return false;
    }


    protected function _returnError($code, $message) {
        $this->ajaxReturn([
            'error_code' => $code,
            'message' => $message,
        ]);
    }

    protected function _returnData($data) {
        $this->ajaxReturn([
            'error_code' => 0,
            'message' => '',
            'data' => $data
        ]);
    }



















}