// 观察者系统 用于订阅watcher
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },

    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update(); // 执行watcher的更新视图的方法。
        });
    }
}

function observe(data) {
    if (typeof data !== 'object') return;

    for (let key of Object.keys(data)) {
        defineReactive(data, key, data[key]);
    }
}


function defineReactive(data, key, val) {
    observe(val);

    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,

        configurable: true,

        get() {

            // 在getter中包含订阅watcher的操作，在实例化该属性的watcher时，会把watcher绑定到Dep静态属性target中，然后读取一下该属性，从而进入这里执行这个订阅操作。
            if (Dep.target) {
                dep.addSub(Dep.target);
            }

            return val;
        },

        set(newval) {
            val = newval;
            dep.notify();  // 触发观察者系统，执行更新视图的方法。
        }
    })
}