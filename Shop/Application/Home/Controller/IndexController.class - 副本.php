<?php
namespace Home\Controller;
require_once(APP_PATH . 'ApiController.class.php');
use Application\ApiController;
use Common\Common\He;
use Common\Common\Ab;
use Home\Logic\DemoLogic;

/**
 * 首页
 * @author wubuze <wubuze@qq.com>
 * @package Home\Controller
 */

class IndexController extends ApiController
{ // 接口必须继承这个控制器

    /**
     * 构造函数
     */
    public function __construct() {
        parent::__construct();

    }



    /**
     * 列表接口 \n
     * URI : /Home/index/index
     * @param :
     *
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     * -------  | -----    | 不必填 | ---
     *
     * @return
     * list:
     *  name   | type     | description
     * --------|----------|----------------------
     * id      | int      | ID
     * name    | string   | 名称
     *
     * @note 此方法请使用post提交 文档使用Doxyfile自动生成
     */
    public function index()
    {

        // 获取http输入参数统一使用下面方法，此方法兼容 get和post的数据
        $name = I('name', '');
        // 参数验证

        // 业务逻辑
        $data = [];
        $data[] = [
            'id' => 1,
            'name' => '张三',
        ];
        $data[] = [
            'id' => 2,
            'name' => '李四',
        ];
        // 返回数据格式化，返回数据里不要出现null
        $this->_returnData(['list' => $data, 'count' => 2]);

    }

    /**
     * 取一条信息
     *
     * URI : /Home/index/index
     * @param :
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     *  id    | int   | 必填 |ID
     * @return
     *  name   | type     | description
     * --------|----------|----------------------
     * id      | int      | ID
     * name    | string   | 名称
     *
     */
    public function item()
    {

        // 单个数据格式为 data ['id' => 1, 'name' => 'xxx']

        $data = [
            'id' => 2,
            'name' => '李四',
        ];
        $this->_returnData($data);
    }

    public function save()
    {
        $demo = new DemoLogic();
        echo $demo->test();
    }




}