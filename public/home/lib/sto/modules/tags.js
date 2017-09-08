/*!
 * BY BrianZhou
 */
(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else if (window.layui && layui.define) {
        layui.define('jquery', function (exports) { //layui����
            exports('tags', factory(layui.jquery, global, global.document, global.Math));
        });
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function($) {

    $.fn.tags = function(options){
        var $this = $(this);
        var defaults = {
            targetSelector:'.target-selector',
            value:["aaa", "bbb", "ccc"],
            maxlength : 20
        };
        var options = $.extend(defaults, options);
        var keyCodes = {
            Enter : 13,
            Enter2 : 108,
            Spacebar:32
        };
        this.each(function(){
            var that = $(options.targetSelector);
            var tagsGroup = '';
            $.each(options.value,function(index,itemObj){
                tagsGroup += '<a "href="javascript:void(0);"><span>'+itemObj+'</span><em></em></a>';
            });
            var str =
                '<div class="plus-tag tagbtn cl">'+tagsGroup+
                '<input type="hidden" class="tags-input" value="'+options.value+'" name="">'+
                '</div>';
            that.append(str);
            var val = that.find('.tags-input');
            var $tagWarp = that.find('.plus-tag');

            /*获取值*/
            function gettagval(obj) {
                var str = "";
                var token = that.find(".plus-tag a");
                if (token.length < 1) {
                    input.val("");
                    return false;
                }
                for (var i = 0; i < token.length; i++) {
                    str += token.eq(i).find('span').text() + ",";
                }
                str = unique(str, 1);
                str=str.join();
                val.val(str);
            }

            /*将字符串逗号分割成数组并去重*/
            function unique(o, type){
                //去掉前后空格
                o=o.replace(/(^\s*)|(\s*$)/g,"");
                if(type == 1) {
                    //把所有的空格和中文号替换成英文号
                    o=o.replace(/(\s)|(�?)/g, ",");
                } else {
                    //把所有的中文逗号替换成英文号
                    o=o.replace(/(�?)/g, ",");
                }
                //去掉前后英文逗号
                o=o.replace(/^,|,$/g, "");
                //去重连续的英文��号
                o=o.replace(/,+/g,',');
                o=o.split(",");
                var n = [o[0]]; //结果数组
                for(var i = 1; i < o.length; i++){
                    if (o.indexOf(o[i]) == i) {
                        if(o[i] == "")
                            continue;
                        n.push(o[i]);
                    }
                }
                return n;
            }

            /*删除标签绑定*/
            $('body').on("click",".plus-tag a em",function(){
                $(this).parents('a').remove();
                var str ="";
                if(that.find(".plus-tag a").length<1){
                    val.val("");
                    return false;
                }else{
                    for(var i = 0;i< that.find(".plus-tag a").length;i++){
                        str += that.find(".plus-tag a").eq(i).find('span').text() + ",";
                    }
                    str = str.substring(0,str.length-1);
                    val.val(str);
                }
            });

            $this.on("keydown",function(e){
                var evt = e || window.event;
                if (evt.keyCode == keyCodes.Enter || evt.keyCode == keyCodes.Enter2 || evt.keyCode == keyCodes.Spacebar) {
                    var v = $this.val().replace(/\s+/g, "");
                    var reg = /^,|,$/gi;
                    v = v.replace(reg, "");
                    v = $.trim(v);
                    if (v != '') {
                        $this.change();
                    }else{
                        return false;
                    }
                }
            });

            $this.on("change",function(){
                var v1 = $this.val();
                var v2 = val.val();
                var isContains  =  v2.indexOf(v1) >= 0;
                var v = v2+','+v1;
                if(!isContains){
                    if(v!=''){
                        var str='';
                        if(v1.length>0){
                            str = '<a "href="javascript:void(0);"><span>'+v1+'</span><em></em></a>';
                            val.val(v);
                            $tagWarp.append(str);
                            $this.val("").blur();
                        }
                    }
                }else{
                    layer.msg('已经添加过');
                }
            });
        });
    };
});