var Feng = {
    ctxPath: "",
    addCtx: function (ctx) {
        if (this.ctxPath == "") {
            this.ctxPath = ctx;
        }
    },
    confirm: function (tip, ensure) {//询问框
        parent.layer.confirm(tip, {
            btn: ['确定', '取消']
        }, function (index) {
            ensure();
            parent.layer.close(index);
        }, function (index) {
            parent.layer.close(index);
        });
    },
    confirmNew: function (tip, ensure, cancel) {//询问框
        parent.layer.confirm(tip, {
            btn: ['确定', '取消']
        }, function (index) {
            ensure();
            parent.layer.close(index);
        }, function (index) {
            cancel();
            parent.layer.close(index);
        });
    },
    log: function (info) {
        console.log(info);
    },
    alert: function (info, iconIndex) {
        parent.layer.msg(info, {
            icon: iconIndex
        });
    },
    info: function (info) {
        Feng.alert(info, 0);
    },
    success: function (info) {
        Feng.alert(info, 1);
    },
    successWithTime: function (info, second = 5) {
        parent.layer.msg(info, {
            icon: 1
        }, second);
    },
    error: function (info) {
        Feng.alert(info, 2);
    },
    errorWithTime: function (info, second = 5) {
        parent.layer.msg(info, {
            icon: 2
        }, second);
    },
    errorAndRelease: function (info) {
        //解除提交限制
        if ($("#ensure").length > 0) {
            $("#ensure").removeAttr("disabled");
        }
        Feng.alert(info, 2);
    },
    infoDetail: function (title, info) {
        var display = "";
        if (typeof info == "string") {
            display = info;
        } else {
            if (info instanceof Array) {
                for (var x in info) {
                    display = display + info[x] + "<br/>";
                }
            } else {
                display = info;
            }
        }
        parent.layer.open({
            title: title,
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['950px', '600px'], //宽高
            content: '<div style="padding: 20px;">' + display + '</div>'
        });
    },
    writeObj: function (obj) {
        var description = "";
        for (var i in obj) {
            var property = obj[i];
            description += i + " = " + property + ",";
        }
        layer.alert(description, {
            skin: 'layui-layer-molv',
            closeBtn: 0
        });
    },
    showInputTree: function (inputId, inputTreeContentId, leftOffset, rightOffset) {
        var onBodyDown = function (event) {
            if (!(event.target.id == "menuBtn" || event.target.id == inputTreeContentId || $(event.target).parents("#" + inputTreeContentId).length > 0)) {
                $("#" + inputTreeContentId).fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);// mousedown当鼠标按下就可以触发，不用弹起
            }
        };

        if (leftOffset == undefined && rightOffset == undefined) {
            var inputDiv = $("#" + inputId);
            var inputDivOffset = $("#" + inputId).offset();
            $("#" + inputTreeContentId).css({
                left: inputDivOffset.left + "px",
                top: inputDivOffset.top + inputDiv.outerHeight() + "px"
            }).slideDown("fast");
        } else {
            $("#" + inputTreeContentId).css({
                left: leftOffset + "px",
                top: rightOffset + "px"
            }).slideDown("fast");
        }

        $("body").bind("mousedown", onBodyDown);
    },
    baseAjax: function (url, tip) {
        var ajax = new $ax(Feng.ctxPath + url, function (data) {
            Feng.success(tip + "成功!");
        }, function (data) {
            Feng.error(tip + "失败!" + data.responseJSON.message + "!");
        });
        return ajax;
    },
    changeAjax: function (url) {
        return Feng.baseAjax(url, "修改");
    },
    zTreeCheckedNodes: function (zTreeId) {
        var zTree = $.fn.zTree.getZTreeObj(zTreeId);
        var nodes = zTree.getCheckedNodes();
        var ids = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            ids += "," + nodes[i].id;
        }
        return ids.substring(1);
    },
    eventParseObject: function (event) {//获取点击事件的源对象
        event = event ? event : window.event;
        var obj = event.srcElement ? event.srcElement : event.target;
        return $(obj);
    },
    sessionTimeoutRegistry: function () {
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            complete: function (XMLHttpRequest, textStatus) {
                //通过XMLHttpRequest取得响应头，sessionstatus，
                var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
                if (sessionstatus == "timeout") {
                    //如果超时就处理 ，指定要跳转的页面
                    window.location = Feng.ctxPath + "/global/sessionError";
                }
            }
        });
    },
    initValidator: function (formId, fields, excluded) {
        $('#' + formId).bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: excluded || [':disabled', ':hidden', ':not(:visible)'],
            fields: fields,
            live: 'enabled',
            message: '该字段不能为空'
        });
    },
    underLineToCamel: function (str) {
        var strArr = str.split('_');
        for (var i = 1; i < strArr.length; i++) {
            strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
        }
        var result = strArr.join('');
        return result.charAt(0).toUpperCase() + result.substring(1);
    },
    randomNum: function (minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    },
    newCrontab: function (href, menuName) {
        var dataUrl = href;
        var needCreateCrontab = true;

        // 轮询已有的标签，判断是否已经存在标签
        parent.$('.J_menuTab').each(function () {
            if ($(this).data('id') == dataUrl) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                    parent.MyCrontab.scrollToTab(this);
                    parent.MyCrontab.$('.J_mainContent .J_iframe').each(function () {
                        if ($(this).data('id') == dataUrl) {
                            $(this).show().siblings('.J_iframe').hide();
                            $(this).attr('src', $(this).attr('src'));
                            return false;
                        }
                    });
                }
                needCreateCrontab = false;
                return false;
            }
        });

        //创建标签
        if (needCreateCrontab) {
            var tabLink = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            parent.$('.J_menuTab').removeClass('active');
            parent.$('.J_menuTabs .page-tabs-content').append(tabLink);

            var iframeContent = '<iframe class="J_iframe" name="iframe' + Feng.randomNum(100, 999) + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
            parent.$('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(iframeContent);
            parent.MyCrontab.scrollToTab($('.J_menuTab.active'));
        }
    },
    isEmpty: function (obj) {
        //验证数据是否为空
        if (obj != null && obj != '' && obj != undefined && obj != 'undefined') {
            return false;
        } else {
            return true;
        }
    },
    number: function (data, val) {
        var numbers = '';
        // 保留几位小数后面添加几个0
        for (var i = 0; i < val; i++) {
            numbers += '0';
        }
        var s = 1 + numbers;
        // 如果是整数需要添加后面的0
        var spot ;
        if(numbers == ''){
            spot = "";
        }else{
            spot = "." + numbers;
        }

        // Math.round四舍五入
        //  parseFloat() 函数可解析一个字符串，并返回一个浮点数。
        var value = Math.round(parseFloat(data) * s) / s;
        // 从小数点后面进行分割
        var d = value.toString().split(".");
        if (d.length == 1) {
            value = value.toString() + spot;
            return value;
        }
        if (d.length > 1) {
            if (d[1].length < 2) {
                value = value.toString() + "0";
            }
            return value;
        }
    },
    hasSign: function (obj) {
        //验证内容是否含有签名
        if (!this.isEmpty(obj) && obj.indexOf("【") > -1 && obj.indexOf("】") > -1 && obj.substring(obj.indexOf("【") + 1, obj.indexOf("】")).length > 0) {
            return true;
        } else {
            return false;
        }
    }
    ,
    replaceSpecial: function (str) {
        //将encodeURIComponent()不转换的特殊字符转为url编码值  ! * ( )
        if (str == '') {
            return '';
        }
        return str.replaceAll('\!', '%21').replaceAll('\\*', '%2A').replaceAll('\'', '%27').replaceAll('\\(', '%28').replaceAll('\\)', '%29');
    }
    ,
    //特殊字符转化为uri编码值
    encodeURIComponentNew: function (str) {
        if (str == '') {
            return '';
        }
        str = encodeURIComponent(str);
        //将encodeURIComponent()不转换的特殊字符转为url编码值  ! * ( )
        return str.replaceAll('\!', '%21').replaceAll('\\*', '%2A').replaceAll('\'', '%27').replaceAll('\\(', '%28').replaceAll('\\)', '%29');
    },
    //修改String原型实现replaceAll
    String1: String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "g"), s2);
    },
    //获取uuid
    getUuid: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    },
    //四舍五入并保留4位小数
    toDecimal: function (num) {
        let numFloat = parseFloat(num);
        if (isNaN(numFloat)) {
            return false;
        }
        numFloat = Math.round(num * 10000) / 10000;
        let numString = numFloat.toString();
        let rs = numString.indexOf('.');
        if (rs < 0) {
            rs = numString.length;
            numString += '.';
        }
        while (numString.length <= rs + 4) {
            numString += '0';
        }
        return numString;
    },

    //查询待审核数量
    queryAuditCount: function (url = "/auditCount/selectAuditCount") {
        var ajax = new $axAsyn(Feng.ctxPath + url, function (data) {
            // console.log(data);
            top.parent.$('#side-menu').find('.badge').remove();
            top.parent.$('#nav-review_certification').append(Feng.noticeNumber(data.certification));
            top.parent.$('#nav-review_SMSTemplate').append(Feng.noticeNumber(data.template));
            top.parent.$('#nav-review_SMSAudit').append(Feng.noticeNumber(data.verificationCode));
            top.parent.$('#nav-review_SMSAudit_marketing').append(Feng.noticeNumber(data.market));
            top.parent.$('#nav-review_SMSAudit_failedReissue').append(Feng.noticeNumber(data.failedReissue));
            top.parent.$('#nav-review_SMSAudit_unidentified').append(Feng.noticeNumber(data.unidentified));
        }, function (data) {
            Feng.error(data.message);
        }, 'none');
        ajax.start();
    },
    noticeNumber: function (value) {
        if (parseInt(value) <= 0) {
            return '';
        }
        if (parseInt(value) > 100) {
            return `<span class="badge badge-danger pull-right">100+</span>`;
        } else {
            return `<span class="badge badge-danger pull-right">${value}</span>`;
        }
    },
    //格式化时间为 yyyy-MM-dd HH:mm:ss 传入Date
    formatDate: function (nowDate) {
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
        var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
        var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    /*
 * 核心方法，实现加减乘除运算，确保不丢失精度
 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 *
 * @param a {number} 运算数1
 * @param b {number} 运算数2
 * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
 * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
 *
 */
    operation: function (a, b, digits, op) {
        var o1 = Feng.toInteger(a);
        var o2 = Feng.toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;
        var t1 = o1.times;
        var t2 = o2.times;
        var max = t1 > t2 ? t1 : t2;
        var result = null;
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max;
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max;
            case 'multiply':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'divide':
                result = (n1 / n2) * (t2 / t1);
                return result
        }
    },

    // 加减乘除的四个接口
    add: function (a, b, digits) {
        return Feng.operation(a, b, digits, 'add')
    },
    subtract: function subtract(a, b, digits) {
        return Feng.operation(a, b, digits, 'subtract')
    },
    multiply: function (a, b, digits) {
        return Feng.operation(a, b, digits, 'multiply')
    },
    divide: function (a, b, digits) {
        return Feng.operation(a, b, digits, 'divide')
    },
    /*
     * 判断obj是否为一个整数
     */
    isInteger: function (obj) {
        return Math.floor(obj) === obj
    },
    /*
      * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
      * @param floatNum {number} 小数
      * @return {object}
      *   {times:100, num: 314}
      */
    toInteger: function (floatNum) {
        var ret = {times: 1, num: 0};
        if (Feng.isInteger(floatNum)) {
            ret.num = floatNum;
            return ret;
        }
        var strfi = floatNum + '';
        var dotPos = strfi.indexOf('.');
        var len = strfi.substr(dotPos + 1).length;
        var times = Math.pow(10, len);
        var intNum = parseInt(floatNum * times + 0.5, 10);
        ret.times = times;
        ret.num = intNum;
        return ret;
    },

    mergeTable: function (field, table) {
        var obj = Feng.getObjFromTable(table, field);

        for (var item in obj) {
            table.bootstrapTable('mergeCells', {
                index: obj[item].index,
                field: field,
                colspan: 1,
                rowspan: obj[item].row,
            });
            // table.bootstrapTable('mergeCells', {
            //     index: obj[item].index,
            //     field: 'selectItem',
            //     colspan: 1,
            //     rowspan: obj[item].row,
            // });
        }


    },

    getObjFromTable:function ($table, field) {
        var obj = [];
        var maxV = $table.find("th").length;

        var columnIndex = 0;
        var filedVar;
        for (columnIndex = 0; columnIndex < maxV; columnIndex++) {
            filedVar = $table.find("th").eq(columnIndex).attr("data-field");
            if (filedVar == field) break;

        }
        var $trs = $table.find("tbody > tr");
        var $tr;
        var index = 0;
        var content = "";
        var row = 1;
        for (var i = 0; i < $trs.length; i++) {
            $tr = $trs.eq(i);
            var contentItem = $tr.find("td").eq(columnIndex).html();
            //exist
            if (contentItem.length > 0 && content == contentItem) {
                row++;
            } else {
                //save
                if (row > 1) {
                    obj.push({"index": index, "row": row});
                }
                index = i;
                content = contentItem;
                row = 1;
            }
        }
        if (row > 1) obj.push({"index": index, "row": row});
        return obj;
    },
    differenceSet:function (arr1, arr2) {
        return [...new Set(arr1.filter(x => !new Set(arr2).has(x)))];
    },
    getLength:function(str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
        }
        return realLength;
    },
};