layui.define("jquery", function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    "use strict";
    var $ = layui.jquery;
    var obj = {
        //tab切换
        tab: function(selector){
            var $ibox = $(selector);
            $ibox.on('click', '.ibox_tab_title li',function(){
                var $this = $(this),
                    index = $this.index();
                $this.addClass('active').siblings('li').removeClass('active');
                $this.parents('.ibox').find('.ibox_tab_content').eq(index).addClass('show').siblings().removeClass('show');
            })
        },

        //橡皮擦清空
        restVal: function(){
            $('body').on('click','i.icon_ca_layui', function(){
                $(this).siblings('input, textarea').val('');
                $(this).siblings('input, textarea').text('');
            })
        },

        //进入页面让数字变化着到指定数字
        changeNub:function(options){
            var defaults = {
                selector:'.timer',      //选择器
                from: 0,               // 开始数字
                to: 0,                 // 结束数字
                speed: 1000,           // 速度
                refreshInterval: 100,  // how often the element should be updated
                decimals: 0,           // the number of decimal places to show
                formatter: formatter,  // handler for formatting the value before rendering
                onUpdate: null,        // callback method for every time the element is updated
                onComplete: null       // callback method for when the element finishes updating
            };
            var settings = $.extend(defaults, options);
            $(settings.selector).each(function(){
                // how many times to update the value, and how much to increment the value on each update
                var loops = Math.ceil(settings.speed / settings.refreshInterval),
                    increment = (settings.to - settings.from) / loops;
                // references & variables that will change with each update
                var self = this,
                    $self = $(this),
                    loopCount = 0,
                    value = settings.from,
                    data = $self.data('countTo') || {};

                $self.data('countTo', data);
                // if an existing interval can be found, clear it first
                if (data.interval) {
                    clearInterval(data.interval);
                }
                data.interval = setInterval(updateTimer, settings.refreshInterval);
                // initialize the element with the starting value
                render(value);
                function updateTimer() {
                    value += increment;
                    loopCount++;
                    render(value);
                    if (typeof(settings.onUpdate) == 'function') {
                        settings.onUpdate.call(self, value);
                    }
                    if (loopCount >= loops) {
                        // remove the interval
                        $self.removeData('countTo');
                        clearInterval(data.interval);
                        value = settings.to;

                        if (typeof(settings.onComplete) == 'function') {
                            settings.onComplete.call(self, value);
                        }
                    }
                }
                function render(value) {
                    var formattedValue = settings.formatter.call(self, value, settings);
                    $self.html(formattedValue);
                }
            });
            function formatter(value, settings) {
                return value.toFixed(settings.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
            }
        },

        //让区域固定在顶部
        navFixed: function(selector){
            var $_this = $(selector),
                $_this_prev_marginBottom = parseInt($_this.prev().css("margin-bottom").substring(0, $_this.prev().css("margin-bottom").length-2)),
                $_this_next_marginTop = parseInt($_this.next().css("margin-top").substring(0, $_this.next().css("margin-top").length-2)),
                _topPosition = $(document).scrollTop(),
                _navPosition = $_this.prev().outerHeight(true);
            _if();
            alert(_topPosition);
            $(document).scroll( function() {
                _topPosition = $(document).scrollTop();
                _if();
            });
            $(window).resize(function(){
                _navPosition = $_this.prev().outerHeight(true);
                _if();
            });
            function _if(){
                if (_topPosition >= _navPosition){
                    $_this.css("position", "fixed");
                    $_this.next().css("margin-top", $_this_prev_marginBottom + $_this.outerHeight() + $_this_next_marginTop + "px");
                }else{
                    $_this.css("position", "relative");
                    $_this.next().css("margin-top", $_this_next_marginTop + "px");
                }
            }
        },

        //form表单伸缩，可配置参数让底部的GRID伸缩，页面需要提供计算grid的高度setTableHeight()，和setTableHeightTwo()——因为表单伸缩要多加10px
        formToggle: function(options){
            var defaults = {
                selector:'.collapse-link',      //选择器
                ifTableResize: false
            };
            var num=0;
            var settings = $.extend(defaults, options);
            $(settings.selector).click(function(){
                var ibox = $(this).closest('div.ibox');
                var iboxTitle = ibox.find('div.ibox_title');
                var button = iboxTitle.find('i');
                var content = ibox.find('div.ibox_form');
                content.slideToggle(200);
                button.toggleClass('icon-down').toggleClass('icon-upward');
                ibox.toggleClass('border_b_n').toggleClass('mb-10');
                iboxTitle.toggleClass('border_b_n').toggleClass('');
                if(settings.ifTableResize){
                    switch (num){
                        case 0:
                            setTimeout("setTableHeightTwo()","200");
                            num++;
                            return;
                        case 1:
                            setTimeout("setTableHeight()","200");
                            num--;
                            return;
                    }
                }
            });
        },

        //动态添加select里面的option,可设置选中的值
        addOption: function(options){
            var defaults = {
                selector:'.select',      //选择器
                data: '',
                key: 'key',
                value: 'value',
                isSelected: false,
                selectedValue: ''
            };
            var settings = $.extend(defaults, options);
            var optionGroup = '<option value>--请选择--</option>';
            if (settings.isSelected) {
                $.each(settings.data, function (key) {
                    if (settings.selectedValue == settings.data[key][settings.key]) {
                        optionGroup += '<option value="' + settings.data[key][settings.key] + '" selected>' + settings.data[key][settings.value] + '</option>';
                    } else {
                        optionGroup += '<option value="' + settings.data[key][settings.key] + '">' + settings.data[key][settings.value] + '</option>';
                    }
                });
            } else {
                $.each(settings.data, function (key) {
                    optionGroup += '<option value="' + settings.data[key][settings.key] + '">' + settings.data[key][settings.value] + '</option>';
                });
            }
            $(settings.selector).empty().append(optionGroup);
        },

        //layui中select 不能通过键盘上下选择，此函数弥补这个问题
        /*selectMove: function(){
            $('body').on('keydown','.layui-form-select .layui-unselect',function(e){
                var $selectBox = $(this).closest('div.layui-form-select');
                switch (e.which){
                    case 40:
                        e.preventDefault();
                        e.stopPropagation();
                        var hasLayThis = $selectBox.find('dd').hasClass('layui-this');
                        var layThis = $selectBox.find('dd.layui-this');
                        if(!hasLayThis){
                            $selectBox.find('dd').eq(0).addClass('layui-this').attr('tabindex','0').focus();
                        }else{
                            var hasThisNext = layThis.next().length == 0;
                            if(hasThisNext){
                                $selectBox.find('dd.layui-this').removeClass('layui-this');
                                $selectBox.find('dd').eq(0).addClass('layui-this').attr('tabindex','0').focus();
                            }else{
                                $selectBox.find('dd.layui-this').removeClass('layui-this').next().addClass('layui-this').attr('tabindex','0').focus();
                            }
                        }
                        return;
                }
            });
            $('body').on('keydown','.layui-form-select dl dd', function(e){
                var $selectBox = $(this).closest('div.layui-form-select');
                var $ddNub = $selectBox.find('dd').length;
                var index = $selectBox.find("dd").index($(this));
                switch (e.which){
                    case 40:
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).removeClass('layui-this').removeAttr('tabindex');
                        var hasNextDd = $(this).next('dd').length == 0;
                        var hasNextDt = $(this).next('dt').length == 0;
                        var isNext = hasNextDd && hasNextDt;
                        if(isNext){
                            $selectBox.find('dd').eq(0).addClass('layui-this').attr('tabindex','0').focus();
                        }else{
                            $selectBox.find('dd').eq(index+1).addClass('layui-this').attr('tabindex','0').focus();
                        }
                        return;
                    case 38:
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).removeClass('layui-this').removeAttr('tabindex');
                        var hasPrev = $(this).prev().length == 0;
                        if(hasPrev){
                            $selectBox.find('dd').eq($ddNub-1).addClass('layui-this').attr('tabindex','0').focus()
                        }else{
                            $selectBox.find('dd').eq(index-1).addClass('layui-this').attr('tabindex','0').focus();
                        }
                        return;
                    case 13:
                        $(this).click();
                        return;
                }
            });
        },*/
        selectMove: function(){
            $('body').on('keydown','.layui-form-select .layui-unselect',function(e){
                var $selectBox = $(this).closest('div.layui-form-select');
                switch (e.which){
                    case 40:
                        move('down');
                        break;
                    case 38:
                        move('up');
                        break;
                    case 13:
                        $selectBox.find('.layui-anim-upbit dd.layui-this').click();
                        break;
                }
                //上下移动
                function move(dir){
                    var items = $selectBox.find('.layui-anim-upbit').children('dd').not('.layui-disabled').not('.layui-hide');
                    var current = items.filter(':visible').filter('.layui-this');
                    var index = current.prevAll('dd').filter(':visible').not('.layui-disabled').length;
                    var total = items.length;
                    switch(dir){
                        case 'up':
                            index--;
                            (index < 0) && (index = (total - 1));
                            break;
                        case 'down':
                            index++;
                            (index >= total) && (index = 0);
                            break;
                    }
                    items
                        .removeClass('layui-this')
                        .eq(index)
                        .addClass('layui-this');
                    scroll();
                }
                //移动滚动条跟随移动
                function scroll(){
                    if(!$selectBox.find('.layui-anim-upbit').length > 0) return;
                    var $item = $selectBox.find('.layui-anim-upbit').children('dd.layui-this');
                    var offsetTop,
                        upperBound,
                        lowerBound,
                        heightDelta = $item.outerHeight();
                    offsetTop = $item[0].offsetTop;
                    upperBound = $selectBox.find('.layui-anim-upbit').scrollTop();
                    lowerBound = upperBound + 180 - heightDelta;
                    if (offsetTop < upperBound) {
                        $selectBox.find('.layui-anim-upbit').scrollTop(offsetTop);
                    } else if (offsetTop > lowerBound) {
                        $selectBox.find('.layui-anim-upbit').scrollTop(offsetTop - 180 + heightDelta);
                    }
                }
            });
        },

        //select 多选，现在不支持form表单原生验证
        multiSelect: function(){
            var $select = $('.layui-form').find("select[multi-select]");

            $select.each(function(){
                var $selectObj = $(this).siblings('.layui-form-select');
                var $selectVal = $selectObj.find('.layui-unselect');

                //去除layui自带的绑定时间
                /*$(document).unbind();*/
/*                $selectObj.find('dl').unbind();*/
                $selectObj.find('dd').unbind();
                $selectObj.find('.layui-select-title').unbind();

                $selectObj.find('.layui-select-title').on('click',function(){
                    $selectObj.toggleClass('layui-form-selected');
                });

                $selectObj.find('dd').on('click',function(e){
                    var $this = $(this);
                    if(!hasChecked($this)){
                        $this.addClass('layui-checked');
                        addVal();
                        e.stopPropagation();
                    }else{
                        $this.removeClass('layui-checked');
                        addVal();
                    }
                });

                function addVal(){
                    if($selectObj.find("dd.layui-checked").length<1){
                        $selectVal.val("");
                        $selectVal.attr('name','');
                        return false;
                    }else{
                        var str="";
                        var name="";
                        for(var i = 0;i< $selectObj.find("dd.layui-checked").length;i++){
                            str += $selectObj.find("dd.layui-checked").eq(i).text() + ",";
                            name += $selectObj.find("dd.layui-checked").eq(i).attr('lay-value') + ",";
                        }
                        str = str.substring(0,str.length-1);
                        name = name.substring(0,str.length-1);
                        $selectVal.val(str);
                        $selectVal.attr('name',name);
                    }
                    event.stopPropagation();
                }

                function hasChecked(obj){
                    return obj.hasClass('layui-checked')
                }
            });

        },

        //select2 多选，取值根据添加顺序添加值
        multiSelect2: function(){
            var $select = $('.layui-form').find("select[multi-select2]");

            $select.each(function(){
                var $selectObj = $(this).siblings('.layui-form-select');
                var $selectVal = $selectObj.find('.layui-unselect');

                //去除layui自带的绑定时间
                /*$(document).unbind();*/
                /*$selectObj.find('dl').unbind();*/
                $selectObj.find('dd').unbind();
                $selectObj.find('.layui-select-title').unbind();

                $selectObj.find('.layui-select-title').on('click',function(){
                    $selectObj.toggleClass('layui-form-selected');
                });

                $selectObj.find('dd').on('click',function(e){
                    var $this = $(this);
                    if(!hasChecked($this)){
                        $this.addClass('layui-checked');
                        addVal($this);
                        e.stopPropagation();
                    }else{
                        $this.removeClass('layui-checked');
                        removeVal($this);
                    }
                });

                function addVal(obj){
                    if($selectObj.find("dd.layui-checked").length<1){
                        $selectVal.val("");
                        $selectVal.attr('name','');
                        return false;
                    }else{
                        var str1 = $selectVal.val();
                        var name1 = $selectVal.attr('name');
                        var str2 = obj.text();
                        var name2 = obj.attr('lay-value');
                        var str ='';
                        var name='';
                        if(str1==''){
                            str = str2;
                            name = name2;
                        }else{
                            str = str1 + ',' + str2;
                            name = name1 + ',' + name2;
                        }
                        $selectVal.val(str);
                        $selectVal.attr('name',name);
                    }
                    event.stopPropagation();
                }

                function removeVal(obj){
                    if($selectObj.find("dd.layui-checked").length<1){
                        $selectVal.val("");
                        $selectVal.attr('name','');
                        return false;
                    }else{
                        var str1 = $selectVal.val();
                        var name1 = $selectVal.attr('name');
                        var str2 = obj.text();
                        var name2 = obj.attr('lay-value');
                        var str = str1.replace(eval("/,?"+str2+",?/"),' ').trim(' ').replace(' ',',');//替换变量str2为空格，若trim成功则表明在首尾，否则，replace空格为,（中间）
                        var name = name1.replace(eval("/,?"+name2+",?/"),' ').trim(' ').replace(' ',',');//替换变量name2为空格，若trim成功则表明在首尾，否则，replace空格为,（中间）
                        $selectVal.val(str);
                        $selectVal.attr('name',name);
                    }
                    event.stopPropagation();
                }

                function hasChecked(obj){
                    return obj.hasClass('layui-checked')
                }
            });

        },

        //多选标签，配合autocomplete,支持输入框和显示标签不在一个input,也支持在一个输入框，同时可以设置默认值
        addTags: function(options){
            var defaults = {
                selector: '#addtags',
                targetSelector:'.target-selector',
                value:[{
                    "id": 0,
                    "name": "Item0"
                    },
                    {
                        "id": 1,
                        "name": "Item11"
                    },
                    {
                        "id": 2,
                        "name": "Item12"
                    }],
                isSeparate: false
            };
            var $this = $(this);
            var options = $.extend(defaults, options);

            $this.each(function () {
                var that = $(options.targetSelector);
                var tagsGroup = '';
                var tagsVal = '';
                var tagsID = '';
                $.each(options.value,function(key){
                    tagsGroup += '<a href="javascript:void(0);" class="tag" value="'+options.value[key].id+'"><span>'+options.value[key].name+'</span><em></em></a>';
                    tagsVal += options.value[key].name + ",";
                    tagsID +=options.value[key].id + ",";
                });
                tagsVal = tagsVal.substring(0, tagsVal.length - 1);
                tagsID = tagsID.substring(0, tagsID.length - 1);

                if(options.isSeparate){
                    var hasWarpClass = that.hasClass('plus-tag');
                    if(!hasWarpClass){
                        var str =
                            tagsGroup+'<input type="hidden" class="tags-input" value="' + tagsVal + '" name="' + tagsID + '">';
                        that.addClass('plus-tag tagbtn cl');
                        that.find(options.selector).before(str);
                    }else{
                        addVal(options.isSeparate);
                    }

                    //聚焦
                    $('body').on('click',options.targetSelector, function(){
                        $(options.selector).focus();
                    });

                    //propertychange监听input里面的字符变化,属性改变事件
                    $(options.selector).bind('input propertychange', function() {
                        var $this = $(this);
                        var text_length = $this.val().length;//获取当前文本框的长度
                        var current_width = parseInt(text_length) *16;//该16是改变前的宽度除以当前字符串的长度,算出每个字符的长度
                        $this.css("width",current_width+"px");
                    });

                }else{
                    var hasWarp = that.find('.plus-tag').length == 0;
                    if(hasWarp){
                        var str =
                            '<div class="plus-tag tagbtn cl">'+tagsGroup+
                            '<input type="hidden" class="tags-input" value="' + tagsVal + '" name="' + tagsID + '">' +
                            '</div>';
                        that.append(str);
                    }else{
                        addVal(options.isSeparate);
                    }
                }

                function addVal(isSeparate){
                    var val = that.find('.tags-input');
                    var $tagWarp = that.find('.plus-tag');
                    var v2 = val.val();
                    var v1 = options.value[0].name;
                    var id1 = options.value[0].id;
                    var id2 = val.attr('name');
                    var isContains  =  v2.indexOf(v1) >= 0;
                    var v = '';
                    var id = '';

                    if(v2==''){
                        v = v1;
                        id = id1;
                    }else{
                        v = v2 + ',' + v1;
                        id = id2 + ',' + id1;
                    }
                    if(!isContains){
                        if(v!=''){
                            if(v1.length>0){
                                val.val(v);
                                val.attr('name', id);
                                isSeparate ? that.find(options.selector).before(tagsGroup):$tagWarp.append(tagsGroup);
                            }
                        }
                    }else{
                        layer.msg('您已添加！！');
                    }
                }


                /*删除标签绑定*/
                $('body').on("click", ".plus-tag a em", function (e) {
                    var val = that.find('.tags-input');
                    $(this).parents('a.tag').remove();
                    var str = "";
                    var idGroup = "";
                    if(that.find("a.tag").length<1){
                        val.val("");
                        val.attr("name","");
                        return false;

                    }else{
                        for(var i = 0;i< that.find("a.tag").length;i++){
                            str += that.find("a.tag").eq(i).find('span').text() + ",";
                            idGroup += that.find("a.tag").eq(i).attr('value') + ","
                        }
                        str = str.substring(0, str.length - 1);
                        idGroup = idGroup.substring(0, idGroup.length - 1);
                        val.val(str);
                        val.attr("name", idGroup);
                    }
                    e.stopPropagation();
                });
            });
        },

        //内页面控制父iframe，动态添加tab页，意思是项目主页面多加一个标签页
        addTabBar:function(url,title,tag){

            //添加之前去除兄弟模块的选中状态
            $('.page_tabs_b .page_tabs_content a.active', parent.document).removeClass('active');

            //根据tag标签判断这个标签是否存在，如果存在就设置成选中状态
            var $tag = $(".page_tabs_b .page_tabs_content a[tag='"+tag+"']", parent.document);
            var isTag = $tag.length;

            if(!isTag){
                var Wh=$(window).height()-47;

                //给父级添加tab标签
                var strTab = '<a href="javascript:void(0)" data-src='+url+' class="active" tag="'+tag+'">' + title + '<i class="iconfont icon-close ml-5" style="font-size: 14px;"></i></a>';
                $(".page_tabs_b .page_tabs_content", parent.document).append(strTab);

                //给父级框架注入iframe
                var iframeDiv = '<div class="page_content show animated fadeInRight" tag="'+tag+'" style="height:'+Wh+'px"><iframe scrolling="yes" frameborder="0" src="'+url+'"></iframe></div>';
                $('.page_content', parent.document).removeClass('show');
                $('.page_content:last', parent.document).after(iframeDiv);
            }else{
                $tag.addClass('active').siblings('a').removeClass('active');
                $('.page_content', parent.document).eq($tag.index()).addClass('show').siblings().removeClass('show');
            }
        },

        //用于复制指定列的单号复制,参数分别为table的选择器,和单号所在的列顺序  注：不是index 从1开始排序
        copyOdd:function(selector,index,clipboard){
            var $table = $(selector);
            var resultLen = 0;
            var resultBegin = 0;
            var column = 2 ;
            var a = {};
            var btnSelector = selector.replace(new RegExp('#'), "");


            //用于点击其他地方移除添加的样式
            $(document).on('mousedown',function(){
                $('td:nth-child('+index+')').find('span').removeAttr('style');
            });
            //添加一个隐藏按钮用于click触发绑定剪切板
            $('body').append('<button id="copy_'+btnSelector+'" hidden>立即提交</button>');

            $table.on('mousedown','tr td:nth-child('+index+')',function(event){
                $('td').find('span').removeAttr('style');
                $(this).find('span').css({'background-color': '#f58664', 'color':'#ffffff'});
                column = $(this).index();
                resultBegin = $(this).parent('tr').index();
                $(selector).addClass('table_copy');
                $("td").mouseover(onMouseOver);
                $("td").mouseup(onMouseUp);
                event.stopPropagation();
            });

            function onMouseUp(){
                a.len = resultLen = Math.abs($(this).parent('tr').index() -  resultBegin) + 1;
                a.text = [];
                var begin = resultBegin = resultBegin > $(this).parent('tr').index() ? $(this).parent('tr').index():resultBegin;
                for(var i = 1; i <= a.len;i++)
                {
                    a.text += $(this).parents('table').find('tr').eq(begin+i).find('td').eq(column).find('span').text()+'\n';
                }
                $(selector).removeClass('table_copy');
                $("td").unbind('mouseover',onMouseOver);
                $("td").unbind('mouseup',onMouseUp);
                $('#copy_'+btnSelector).click();
                return a;
            }
            function onMouseOver (){
                $('td:nth-child('+index+')').find('span').removeAttr('style');
                var len = resultLen = Math.abs($(this).parent('tr').index() -  resultBegin) + 1;
                var begin = resultBegin;
                if(resultBegin > $(this).parent('tr').index()){
                    for(var i = -1; i < len-1;i++){
                        $(this).parents('table').find('tr').eq(begin-i).find('td').eq(column).find('span').css({'background-color': '#f58664', 'color':'#ffffff'});
                    }
                }else{
                    for(var i = 1; i <= len;i++){
                        $(this).parents('table').find('tr').eq(begin+i).find('td').eq(column).find('span').css({'background-color': '#f58664', 'color':'#ffffff'});
                    }
                }
            }
            var clipboard1 = new clipboard('#copy_'+btnSelector, {
                text: function() {
                    return a.text;
                }
            });
            clipboard1.on('success', function(e) {
                layer.msg('成功复制'+ a.len+'条单号!');
            });
            clipboard1.on('error', function(e) {
                layer.msg('复制失败');
            });
        },

        //修复autocomplete显示多列不出滚动条，出滚动条后keyup上线选择滚动条不移动的问题
        typeaheadMove:function(selector){
            var $this = $(selector);
            $this.on('keyup',function(e){
                switch (e.which){
                    case 40:
                        e.preventDefault();
                        e.stopPropagation();
                        scroll();
                        return;
                    case 38:
                        e.preventDefault();
                        e.stopPropagation();
                        scroll();
                        return;
                }
            });
            function scroll(){
                if(!$this.siblings('.typeahead').length > 0) return;
                var $item = $this.siblings('.typeahead').children('li.active');
                var offsetTop,
                    upperBound,
                    lowerBound,
                    heightDelta = $item.outerHeight();
                offsetTop = $item[0].offsetTop;
                upperBound = $this.siblings('.typeahead').scrollTop();
                lowerBound = upperBound + 180 - heightDelta;
                if (offsetTop < upperBound) {
                    $this.siblings('.typeahead').scrollTop(offsetTop);
                } else if (offsetTop > lowerBound) {
                    $this.siblings('.typeahead').scrollTop(offsetTop - 180 + heightDelta);
                }
            }
        }
    };
    //输出test接口
    exports('test', obj);
});