# 快照

一个小工具，可以为你页面中需要异步加载数据才渲染的dom片段存储到localStorage中，下次进入页面时可直接先显示localStorage中的快照，再切换为数据拉去完毕后异步渲染出来的片段。从而增强用户体验。

### 1. 使用说明

只要在你想要进行快照显示的文档的父节点标签上添加`data-snapshot="fragmentName"`即可，例如：

	<div class="order-detail" data-snapshot="order-detail">
  		<h3 class="title">{{title}}</h3>
  		<div class="total">{{total}}</div>
  		<div class="date">{{date}}</div>
	</div>
