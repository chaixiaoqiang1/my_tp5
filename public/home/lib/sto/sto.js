layui.config({
    //base: 'lib/sto/modules/' //假设这是test.js所在的目录
    base: 'lib/sto/modules/' //假设这是test.js所在的目录
}).extend({ //设定模块别名
    test: 'test' //如果test.js是在根目录，也可以不用设定别名
    ,autocomplete: 'autocomplete'  //自动补全
    ,slimscroll: 'slimscroll' //最小滚动
    ,jstree: 'jstree' //jstree树
    ,tags: 'tags'
    ,clipboard: 'clipboard'
});

