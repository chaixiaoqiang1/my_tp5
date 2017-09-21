<?php
namespace app\Home\controller;
use think\Db;
use think\View;
use think\Controller;

class Index extends Controller
{

    public function index(){
        $return = M('admin')->select();  // 操作数据库获取数据第二种方法 Tp5不支持M()要自己3.2需要自已定义
        //测试TP5用法
//        echo M('admin')->getLastSql();  //只有这一种获取最后一条Sql方法   _sql不支持
        $sql = "select * from tp5_admin";
        $return = Db::query($sql);  // 操作数据库获取数据第二种方法
        $this->assign('data',$return);
        return $this->fetch();
        // fetch方法使用已解决   解决方法：加载Controller类不对 应为think\Controller
        //        $this->view->replace(['__PUBLIC__' => './Public',]);  //模板中内容替换 3.2的__PUBLIC__不可用  也可以在配置文件中修改
    }

    // 测试URL请求方式  5中U函数不可用,替代函数url  函数在控制器中和模板中的使用一样　模板中加‘：’
    public function  welcome(){
        $a = url('hello/world');
        return 'hello world';
    }

    public function welcomeExpress(){
        return $this->fetch();
    }

}
