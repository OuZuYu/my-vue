function Vue(options) {
    this.data = options.data(); // vue的data是一个工厂函数
    let dom = document.querySelector(options.el);

    // 代理下data的属性
    for (let key of Object.keys(this.data)) {
        this.proxy(key);
    }

    observe(this.data); // 为data 的属性进行 Object.defineProperty 操作

    new Compile(dom, this); // 解析dom，初始化视图，为双向绑定的属性生成watcher实例
}

Vue.prototype.proxy = function (key){
    Object.defineProperty(this, key, {
        configurable: false,

        enumerable: true,

        get () {
            return this.data[key];
        },

        set (newVal) {
            this.data[key] = newVal;
        }
    });
}