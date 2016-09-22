<?php
namespace Home\Controller;
require_once(APP_PATH . 'ApiController.class.php');
use Application\ApiController;
use Home\Logic\DemoLogic;

class IndexController extends ApiController
{ // 接口必须继承这个控制器

    /**
     * 列表接口 \n
     * URI : /home/index/index
     * @param :
     *
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     *  name    | string   | 不必填 |名称
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
     * @param ：
     * name     | type     |  null |description
     * ---------|----------|-------|-------------
     *  id    | int   | 必填 |ID
     * @return :
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

    public function delete()
    {
        $this->_returnError(1, '这是一个api返回范例');
    }
}