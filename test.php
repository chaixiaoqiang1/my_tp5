<?php

//测试类的重载方法

class Test{
    private $name = "private name";
    // 设置未定义的属性
    public function __set($n,$v){
        $this->$n = $v;
    }
    // 获取未定义或权限不够的变量
    public function __get($name){
        echo $this->$name;
    }
}

$obj =  new Test();
$obj->name = 'chaixiaoqiang';  // 私有属性不能在外部设置和调用 公共的类外可以调用
echo $obj->name;
// 但是加上重载函数就变的类外可以使用   相当于调用公共的方法  公共方法内部调用或设置了私有属性