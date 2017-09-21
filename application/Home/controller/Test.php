<?php
namespace app\Home\controller;
use think\Db;
use think\Request;
use think\Controller;

class Test extends Controller
{
    public function index(){
        $return = Db::query('select * from tp5_admin');
        $this->assign('data',$return);
        return $this->fetch();
    }

    public function add(Request $request){
        if($request->isPost()){
            $post = Request::instance()->param();
            $post['addtime'] = time();
            $post['status'] = 1;
            $return = Db::table('tp5_admin')->insert($post);
            if($return){
                return 'true';
            }else{
                return 'false';
            }
        }
        return $this->fetch();
    }

    public function updata(Request $request){
        $id = input('id');
        if($request->isPost()){
            $post = Request::instance()->param();
            $return = Db::table('tp5_admin')->where('id', $id)->update($post);
            if($return){
                return 'true';
            }else{
                return 'false';
            }
        }
        $data = Db::table('tp5_admin')->where('id',$id)->find();
        $this->assign('id',$id);
        $this->assign('data',$data);
        return $this->fetch();
    }

    public function delete(){
        $id = input('id');
        if($id){
            $return = Db::table('tp5_admin')->delete($id);
            if($return){
                return 'true';
            }else{
                return 'false';
            }

        }
    }
    //验证码按手册上composer直接死丢丢了...
}
