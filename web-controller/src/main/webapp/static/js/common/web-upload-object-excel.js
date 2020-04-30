/**
 * web-upload excel上传工具类
 *
 * 约定：
 * 上传按钮的id = 文件隐藏域id + 'BtnId'
 * 文件预览框的id = 文件隐藏域id + 'PreId'
 *
 * 
 */
(function () {

    var $WebUploadExcel = function (fileId) {
        this.fileId = fileId;
        this.uploadBtnId = fileId + "BtnId";

        this.uploadUrl = Feng.ctxPath + '/mgr/upload';
        this.fileSizeLimit = 1000 * 1024 * 1024;
        this.picWidth = 800;
        this.picHeight = 800;
        this.uploadBarId = null;
    };

    $WebUploadExcel.prototype = {
        /**
         * 初始化webUploader
         */
        init: function () {
            var uploader = this.create();
            this.bindEvent(uploader);
            return uploader;
        },

        /**
         * 创建webuploader对象
         */
        create: function () {
            var webUploader = WebUploader.create({
                auto: true,
                pick: {
                    id: '#' + this.uploadBtnId,
                    multiple: false,// 只上传一个

                },
                accept: {
                    title: 'Images',
                    extensions: 'xls,xlsx',
                    mimeTypes: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },

                swf: Feng.ctxPath
                    + '/static/js/plugins/webuploader/Uploader.swf',
                disableGlobalDnd: false,
                duplicate: true,
                server: this.uploadUrl,
                fileSingleSizeLimit: this.fileSizeLimit,
                paste: '#' + this.uploadBtnId,
                dnd: '#' + this.uploadBtnId
            });

            return webUploader;
        },

        /**
         * 绑定事件
         */
        bindEvent: function (bindedObj) {
            var me = this;
            bindedObj.on('fileQueued', function (file) {
                var $li = $('<div><img width="515px" height="200px"></div>');
                var $img = $li.find('img');
                layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
            });

            // 文件上传过程中创建进度条实时显示。
            bindedObj.on('uploadProgress', function (file, percentage) {
                $("#" + me.uploadBarId).css("width", percentage * 100 + "%");
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            bindedObj.on('uploadSuccess', function (file, response) {
                layer.closeAll();
                var ajax = new $ax(Feng.ctxPath + "/complaint/tornado/uploadExcel", function (data) {
                    var list = data.batchComplaintList;
                    $("#originalFileName").val(data.originalFileName);
                    $("#fileName").val(data.fileName);
                    var $tr = [];
                    var $td;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].errorMessage == '' || list[i].errorMessage == undefined) {
                            $td = $('<tr style="border: 1px solid black;"></tr>');
                        } else {
                            $td = $('<tr style="color: red;border: 1px solid black;"></tr>');
                        }
                        $('<td>' + list[i].complaintTime + '</td>').appendTo($td);
                        $('<td>' + list[i].platformId + '</td>').appendTo($td);
                        $('<td>' + list[i].username + '</td>').appendTo($td);
                        $('<td>' + list[i].phone + '</td>').appendTo($td);
                        $('<td>' + list[i].company + '</td>').appendTo($td);
                        $('<td>' + list[i].way + '</td>').appendTo($td);


                        $td.appendTo($('#tbody'))
                    }
                    /*for(var j=0;j<$tr.length;j++){
                        $($tr[j]).appendTo($('#avatarImgListId'));
                    }*/

                }, function (data) {
                    Feng.error("上传失败!请检查上传的文件！");
                });
                ajax.set("fileName", response);
                ajax.set("originalFileName", file.name);
                ajax.start();


            });

            // 文件上传失败，显示上传出错。
            bindedObj.on('uploadError', function (file, response) {
                Feng.error("上传失败");
            });

            // 其他错误
            bindedObj.on('error', function (type) {
                if ("Q_EXCEED_SIZE_LIMIT" == type) {
                    Feng.error("文件大小超出了限制");
                } else if ("Q_TYPE_DENIED" == type) {
                    Feng.error("文件类型不满足");
                } else if ("Q_EXCEED_NUM_LIMIT" == type) {
                    Feng.error("上传数量超过限制");
                } else if ("F_DUPLICATE" == type) {
                    Feng.error("图片选择重复");
                } else {
                    Feng.error("上传过程中出错");
                }
            });

            // 完成上传完了，成功或者失败
            bindedObj.on('uploadComplete', function (file) {
            });
        },

        /**
         * 设置上传的进度条的id
         */
        setUploadBarId: function (id) {
            this.uploadBarId = id;
        }
    };

    window.$WebUploadExcel = $WebUploadExcel;

}());