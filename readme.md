本项目是一个搭建平台的简化版项目，`server/activity.json` 是一个活动的配置 json 文件，可以使用本项目将其构建并渲染出来。

client 端需要提供一个 `renderAppToHtml` 函数来生成 SSR 的页面，这一步使用 rollup 来打包。

## 运行流程

- `yarn build:client`
- `yarn start` 后在浏览器中访问相应端口

或者直接运行 `yarn start:clean` 会清理之前的构建结果并重新执行整个构建流程。

## 配置文件说明

当前这个配置文件 `server/activity.json` 中包含了文本组件、图片容器及倒计时组件，选择的原因是文本和图片常用且简单，还可以通过倒计时是否正常来判断编译的页面上 js 是否正常运行。

可以将这个文件替换成你自己的配置文件进行测试。

## 不包含的内容

- 活动轮次的处理
- 页面配置（如分享、背景色等）的处理
- nested 类型组件的处理，如热区
- ...
