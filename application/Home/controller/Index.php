<?php
namespace app\Home\controller;
use think\Db;
use think\View;
use think\Controller;

class Index extends Controller
{

    public function index(){
        /*if($id){
            var_dump($id);die;
        }*/
//        $gid = $_GET['id'];
        $return = M('admin')->select();  // 操作数据库获取数据第二种方法 Tp5不支持M()要自己3.2需要自已定义
        // 测试TP5用法
        // echo M('admin')->getLastSql();  //只有这一种获取最后一条Sql方法   _sql不支持
        $sql = "select * from tp5_admin";
        $return = Db::query($sql);  // 操作数据库获取数据第二种方法
        $this->assign('data',$return);
        return $this->fetch();
        // fetch方法使用已解决   解决方法：加载Controller类不对 应为think\Controller
        // $this->view->replace(['__PUBLIC__' => './Public',]);  //模板中内容替换 3.2的__PUBLIC__不可用  也可以在配置文件中修改
    }

    // 测试URL请求方式  5中U函数不可用,替代函数url  函数在控制器中和模板中的使用一样　模板中加‘：’
    public function  welcome(){
        if(input('post.')){
            echo 'post';  //  input('post.') 相当于tp3是否IS_POST
        }
        if(input('get.')){
            echo 'get';
        }



        $a = url('hello/world');
        return 'hello world';
    }

    public function welcomeExpress(){
        return $this->fetch();
    }


    public function orderImport(Request $request){
        if($request->isPost()){

            if($request->post('name') == 1){


            }

            $res = $this->validate(input('post.'),'Order');


            if(!captcha_check(input('post.captcha'))){
                $this->result([],0,'error','json');
            };
            if($res !== true){
                $this->result([],0,$res,'json');
            }
            dump($res);
            exit;

            $file = $request->file('order');
            // 移动到框架应用根目录/public/uploads/ 目录下
            $info = $file->validate(['size'=>100000,'type'=>array()])->move(ROOT_PATH . 'public' . DS . 'uploads' . DS .'orders');
            if($info){
                // 成功上传后 获取上传信息
                // 输出 jpg
                echo $info->getExtension();
                // 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
                echo $info->getSaveName();
                // 输出 42a79759f284b767dfcb2a0197904287.jpg
                echo $info->getFilename();
            }else{
                // 上传失败获取错误信息
                echo $file->getError();
            }

        }



        return $this->fetch();
    }
    /**
     * 验证码生成方法
     */
    public function VerifyImg()
    {
        $config = array(
            'imageH' => 45,    //图片高度
            'imageW' => 110,    //图片宽
            'fontSize' => 15, //字体大小

            'length' => 4,    //验证码位数
            'bg' => array(242, 242, 242),// 背景颜色

            //'expire'=>5,	//验证码有效期
        );

        $captcha = new Captcha($config);
        $captcha->useZh = true;
        $captcha->zhSet = '们以我到他会作时要动国产的一是工就年阶义发成部民可出能方进在了不和有大这';
        return  $captcha->entry();
    }



}
