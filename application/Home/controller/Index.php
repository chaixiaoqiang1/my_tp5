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
        echo M('admin')->getLastSql();  //只有这一种获取最后一条Sql方法   _sql不支持
        $sql = "select * from tp5_admin";
        $return = Db::query($sql);  // 操作数据库获取数据第二种方法
        $this->assign('data',$return);
        return $this->fetch();
        // fetch方法使用已解决   解决方法：加载Controller类不对 应为think\Controller
//        return 'Home->Index->index';

    }

}
