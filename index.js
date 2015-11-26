;(function() {
  'use strict';

  if (document.readyState === 'complete') {
    // 如果文档已完成接收，则直接调用
    setTimeout(go);
  } else {
    // 否则监听 DOMContentLoaded 事件
    document.addEventListener('DOMContentLoaded', go);
  }

  function go() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var nodes = document.querySelectorAll('[data-snapshot]');
    var observer;

    // 创建观察者对象
    try {
      observer = new MutationObserver(observerCB);
    } catch(e) {}

    // 遍历具有data-snapshot属性的节点并将其内容替换为上一次存储在本地的快照
    for (var i = nodes.length - 1; i >= 0; i--) {

      nodes[i].innerHTML = getSnapshot(nodes[i]);

      // 对不支持MutationObserver的浏览器做兼容
      if (observer && observer.observer) {
        observer.observe(nodes[i], { childList: true, subtree: true });
      } else {
        observeDom(nodes[i]);
      }
    }
  }

  function observerCB(mutations) {
    var node = mutations[0].target;
    saveSnapshot(node);
    this.disconnect();
  }

  function getNodePath(node) {
    var res = [];
    var tempNode;
    var i;

    while(node) {
      tempNode = node;

      for (i = 0; tempNode; i++) {
        tempNode = tempNode.previousElementSibling;
      }
      res.push(i);
      node = node.parentNode;
    }

    return res.join('-');
  }

  function observeDom(node) {
    var oldFragment = getSnapshot(node);

    if (oldFragment === node.innerHTML) {
      setTimeout(function() {
        observeDom(node, oldFragment);
      }, 500);
    } else {
      // 如果观察片段发生变化，将最新的片段存储到localStorage
      saveSnapshot(node);
    }
  }

  function getSnapshot(node) {
    var name = node.getAttribute('data-snapshot') || getNodePath(node);

    return localStorage.getItem(location.pathname + name) || '';
  }

  function saveSnapshot(node) {
    var name = node.getAttribute('data-snapshot') || getNodePath(node);
    var comments = '<!-- ' + new Date().getTime() + ' -->';
    localStorage.setItem(location.pathname + name, comments + node.innerHTML);
  }
})();
