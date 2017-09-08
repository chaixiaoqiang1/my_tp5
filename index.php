<?php
/**
 * 把public下的index文件改写到项目根目录
 */
// [ 应用入口文件 ]
// 定义应用目录

define('APP_PATH', __DIR__ . '/application/');

define("PUBLIC_PATH",'/test/my_tp5/public/home'); //定义public目录  懒人一个 不想在配置文件  进行修改
// 加载框架引导文件
require __DIR__ . '/thinkphp/start.php';