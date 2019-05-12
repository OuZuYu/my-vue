function Compile (el, vm) {
    this.el = el;
    this.vm = vm;

    this.compileElement(el);
}

Compile.prototype = {
    compileElement (el) {
        let childs = el.childNodes;

        Array.from(childs).forEach(node => {
            let reg = /\{\{(.*)\}\}/;
            let text = node.textContent;

            if (this.isElementNode(node)) // 元素节点
                this.compile(node)
            else if (this.isTextNode(node) && reg.test(text)) { // 文本节点
                this.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        })
    },

    compile (node) {
        let nodeAttr = node.attributes;
        Array.from(nodeAttr).forEach(attr => {
            if (this.isDirective(attr.nodeName)) { // v-model属性
                node.value = this.vm[attr.nodeValue]; // 初始化

                // 绑定input事件，达到视图更新数据目的
                node.addEventListener('input', () => {
                    this.vm[attr.nodeValue] = node.value;
                })

                new Watcher(this.vm, attr.nodeValue, val => {
                    node.value = val;
                })
            }

        })
    },

    compileText (node, exp) {
        node.textContent = this.vm[exp]; // 初始化

        new Watcher(this.vm, exp, val => {
            node.textContent = val;
        });
    },

    isElementNode (node) {
        return node.nodeType === 1;
    },

    isTextNode (node) {
        return node.nodeType === 3;
    },

    isDirective (attr) {
        return attr === 'v-model';
    }
}