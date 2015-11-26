;(function() {
  'use strict'

  if (document.readyState === 'complete') {
    // 如果文档已完成接收，则直接调用
    setTimeout(go, 1);
  } else {
    // 否则监听 DOMContentLoaded 事件
    document.addEventListener('DOMContentLoaded', go, false);
  }

  function go() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver

    // 创建观察者对象
    try {
      var observer = new MutationObserver(function(mutations) {
          var node = mutations[0].target;
          var name = node.getAttribute('data-observer') || getNodePath(node);
          var newFragment = node.innerHTML;
          var comments = '<!-- ' + new Date().getTime() + ' -->';

          localStorage.setItem(name, comments + newFragment);
          this.disconnect();
      });
    } catch(e) {}

    var nodes = document.querySelectorAll('[data-observer]');

    // 遍历具有data-observer属性的节点并将其内容替换为上一次存储在本地的快照
    for (var i = nodes.length - 1; i >= 0; i--) {
      var name = nodes[i].getAttribute('data-observer') || getNodePath(nodes[i]);
      var oldFragment = localStorage.getItem(name) || '';

      nodes[i].innerHTML = oldFragment;

      // 对不支持MutationObserver的浏览器做兼容
      if (observer && observer.observer) {
        observer.observe(nodes[i], { childList:true, subtree: true });
      } else {
        observeDom(nodes[i], oldFragment);
      }
    }
  }

  function getNodePath(node) {
    var res = [];

    while(node) {
      var tempNode = node;

      for (var i = 0; tempNode; i++) {
        tempNode = tempNode.previousElementSibling || null;
      }
      res.push(i);
      node = node.parentElement || null;
    }

    return res.join('-');
  }

  function observeDom(node, oldFragment) {
    setTimeout(function() {
      var newFragment = node.innerHTML;

      if (oldFragment == newFragment) {
        observeDom(node, oldFragment);
      } else {
        // 如果观察片段发生变化，将最新的片段存储到localStorage
        var name = node.getAttribute('data-observer') || getNodePath(nodes[i]);
        var comments = '<!-- ' + new Date().getTime() + ' -->';
        localStorage.setItem(name, comments + newFragment);
      }
    }, 100);
  }
})();
