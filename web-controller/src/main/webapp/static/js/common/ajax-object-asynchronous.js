//用来发送异步ajax请求的
(function () {
    var $axAsyn = function (url, success, error,beforeSend,complete) {
        this.url = url;
        this.type = "post";
        this.data = {};
        this.dataType = "json";
        this.async = true;
        this.success = success;
        this.error = error;
        this.beforeSend = beforeSend || function () {
            
        };
        this.complete = complete || function () {
            
        };
    };

    $axAsyn.prototype = {
        start: function () {
            var me = this;

            if (this.url.indexOf("?") == -1) {
                this.url = this.url + "?jstime=" + new Date().getTime();
            } else {
                this.url = this.url + "&jstime=" + new Date().getTime();
            }

            $.ajax({
                type: this.type,
                url: this.url,
                dataType: this.dataType,
                async: this.async,
                data: this.data,
                beforeSend: function (data) {
                    if (me.beforeSend !== 'none') {
                        layer.load(1, {
                            shade: [0.1,'#fff'] //0.1透明度的白色背景
                        });
                        me.beforeSend(data);
                    }

                },
                complete: function(data) {
                    me.complete(data);
                    layer.closeAll();
                },
                success: function (data) {
                    layer.closeAll();
                    me.success(data);
                },
                error: function (data) {
                    layer.closeAll();
                    me.error(data);
                }
            });
        },

        set: function (key, value) {
            if (typeof key == "object") {
                for (var i in key) {
                    if (typeof i == "function")
                        continue;
                    this.data[i] = key[i];
                }
            } else {
                this.data[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
            }
            return this;
        },

        setData: function (data) {
            this.data = data;
            return this;
        },

        clear: function () {
            this.data = {};
            return this;
        }
    };

    window.$axAsyn = $axAsyn;

}());