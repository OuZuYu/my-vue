function Watcher(vm, exp, cb) {
    this.cb = cb; // 一个更新视图的方法
    this.vm = vm;
    this.exp = exp;

    // 绑定自己到Dep.target
    Dep.target = this;

    // 就是此处，读取一下自己，从而进入getter，订阅自己（Dep.target）
    this.value = this.vm[this.exp];

    // 释放Dep.target
    Dep.target = null;
}

Watcher.prototype = {
    update () {
        let newValue = this.vm[this.exp];
        let oldValue = this.value;

        if (newValue !== oldValue) {
            this.cb.call(this.vm, newValue, oldValue)
        }
    }
}