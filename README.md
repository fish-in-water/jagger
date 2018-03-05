# Jagger

前端通用基础脚手架，ES7全端同构融合方案，标准化主流前端技术选型，解决前端工程化难题，减少项目前期框架选型与投入。

## 1、概要

1. 通用前端基础脚手架，根据项目需要灵活引入资源，支持多路由；
2. ES7全端同构，包括Node Server、Front End、Unit Test、E2E Test；
3. Webpack免配置化开发，支持Chunk、Lazy-Load，无需繁琐的配置过程；
4. 更合理的静态资源管理与包管理，以功能划分资源路径，相对路径引用更易使用；
5. 支持VS Code Node Debug，后端调试更易用，异常定位更简单；
6. 无需干预的打包部署策略，可配置化的资源路径引用策略，部署更简单；
7. 预置Vue2.0 SSR & 前后端融合，平衡页面渲染速度与开发效率；
8. 生产静态资源自动添加MD5 Hash尾缀，合理利用CDN缓存；
9. 预置Swig模板引擎 + PostCSS处理器。
10. Node Server / Front End Live Reload；

## 2、安装

1. 安装Visual Studio Code，以下简称为VS Code

   > 可选，如不使用，无法使用Node Debug

2. 安装Node 8.X （建议安装nvm、avn，以便自动切换Node版本）

   > 建议安装nvm、van，自动切换Node版本
   >
   > https://github.com/creationix/nvm
   > https://github.com/wbyoung/avn

3. 安装VS Code相关插件（可选）

   * Debugger for Chrome
   * EditorConfig for VS Code
   * ESLint
   * 根据需要安装Swig、PostCSS、Vue等其他插件

## 3、开始

### 3-1、开发环境

1. 获取Jagger工程目录至本地；
2. 进入项目根目录，使用npm install 安装包；
3. npm run dev启动项目工程；
4. 浏览器打开http://localhost:3000/jagger/samples/hello-world;

> 使用BrowserSync支持Live Reload，默认使用3000端口代理应用3002端口，端口配置可在config/index.js中修改，具体见《工程配置》章节。

### 3-2、打包构建

1. npm run build

### 3-3、生产环境

1. npm run production
2. 浏览器打开http://localhost:3002/jagger/samples/hello-world;

## 4、更多示例

### 4-1、资源引用

浏览器打开 http://localhost:3000/jagger/samples/reference

HTML、CSS、内联CSS、JS中的静态资源引用均使用相对路径，更多相关信息见《资源管理》章节。

### 4-2、懒加载

浏览器打开 http://localhost:3000/jagger/samples/lazy-load

点击Load按钮，弹出Lazy-Load模块

### 4-3、Vue SSR & 前后端融合

#### 4-3-1 开发模式

1. npm run dev启动开发模式
2. 浏览器打开 http://localhost:3000/jagger/samples/vue-ssr-app，开发模式下未启用SSR
3. 增加ssr参数，http://localhost:3000/jagger/samples/vue-ssr-app?__ssr=1，开发模式下启用SSR

> 为提高开发效率，开发模式下默认不启用SSR，如需启用，需要加入__ssr=1参数

#### 4-3-2 生产模式

1. npm run build
2. npm run production
3. 浏览器打开http://localhost:3002/jagger/samples/vue-ssr-app

> 生产模式默认启用SSR

### 4-4、自动化测试

使用一个加法计算器http://localhost:3000/jagger/samples/calculator作为目标测试路径

#### 4-4-1 单元测试

npm run test:unit

#### 4-4-2 端到端测试

1. npm run dev启动项目
2. 新建命令窗口，进入项目目录，输入npm run test:e2e

### 4-5、Mirage模式

试验属性，默认不启用，可略过。

通过记录页面跳转关系，预加载下一页面的静态资源，减少页面跳转时间，提高页面加载速度。

例如在A页面有可能跳转至B页面，在用户打开A页面时，系统通过懒加载的方式，预先缓存B页面资源。

1. 修改config/index.js配置文件，增加以下内容启用mirage模式

   >```
   >module.exports = {
   >  browserSync: ...
   >  mirage: {
   >    enable: true,   // 启用
   >    limit: 3,     // 预加载Top页面数
   >    interval: 1000  // 缓存刷新时长
   >  },
   >  ...
   >};
   >```

2. npm run build重新编译

3. npm run production启动生产模式

4. 打开浏览器的开发者工具，打开Network选项

5. 浏览器打开http://localhost:3002/jagger/samples/mirage

6. 点击go App按钮，跳转至天气页面

7. 浏览器重新打开http://localhost:3002/jagger/samples/mirage，观察Network选项，已将天气页面的静态资源预加载完成

   > Jagger默认不启用该模式，仅作为试验项目

## 5、资源管理

### 5-1、工程组织

以为功能（页面、组件）划分静态资源目录，有别于传统根据类型（js、css、img目录）划分，更适合快速开发。

```
.
├── logo.jpg
├── reference.js
├── reference.pcss
└── reference.swig
```

### 5-2、JS & CSS标签

自定义JS、CSS标签，路径均使用相对路径，如需导出NPM模块见下一章节。

例如：

```
<css src='./reference.pcss'></css>
<js src="jquery" chunk="vendor" cache="true"></js> 
<js src='./reference.js'></js>
```



CSS

| 属性      | 示例                                       | 说明                                    |
| ------- | ---------------------------------------- | ------------------------------------- |
| cache   | <css src="../components/reset.pcss"  cache="true"></css> | 是否使用浏览器缓存，工程启动后首次打开更新，避免重复编译，提高页面刷新速度 |
| compile | <css src="../../vendors/frozenui/dist/css/basic.css" compile="false"></css> | 是否需编译，如资源无需资源编译，例如引用以编译完成的css文件       |
| chunk   | <css src="../../vendors/frozenui/dist/css/basic.css" chunk="vendor" compile="false"></css> | 指定打包至指定的chunk文件，默认值为app               |



JS提供以下命令属性

| 属性      | 示例                                       | 说明                                       |
| ------- | ---------------------------------------- | ---------------------------------------- |
| cache   | <js src="jquery" cache="true"></js>      | 使用浏览器缓存，工程启动后首次打开更新，避免重复编译，提高页面刷新速度      |
| compile | <js src="../../../../vendors/zepto/zepto.js" compile="false"></js> | 是否需编译，如资源无需资源编译，例如引用以编译完成的js文件，注意Zepto不支持ES6 Module |
| chunk   | <js src="../../../../vendors/zepto/zepto.js" chunk="vendor" cache="true" compile="false"></js> | 指定打包至指定的chunk文件，默认值为app                  |
| library | <js src="./components/godzilla/godzilla.js" chunk="vendor" cache="true" library="godzilla"></js> | 自定义模块导出为webpack library模块，以便区分chunk      |

### 5-2、NPM包管理

使用npm安装后即可使用， npm install query —save

#### 5-2-1 直接引用

直接引用将导致单文件过大，为提高项目渲染效率，建议通过chunk分离vendor

```
import $ from 'jquery';
```

#### 5-2-2 外部引用

1. 首先在模板中引入外部资源文件

   ```
   <js src="jquery" chunk="vendor" cache="true"></js> 
   ```

2. 然后在JS中引用

   ```
   import $ from 'jquery';
   ```

有利于将不经常变动的模块例如jquery打包至vendor，利用浏览器缓存提高页面加载速度

## 6、工程配置

### 6-1、目录组织

查看.config目录

```
config
├── client.config.js  // 前端配置
├── index.js	// 前后端配置
└── server.config.js  // 后端配置
```

其中

* index.js 工程全局配置选项，前后端均可见
* server.config.js 后端配置选项，前端不可见，存放后端配置信息，不暴露给前端，例如存放密钥等信息
* client.config.js 前端配置选项，后端不可见，存放前端配置信息

工程配置选项

| 参数          | 示例                                       | 说明                                       |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| env         | NODE_ENV=dev                             | 取值 NODE_ENV环境变量                          |
| test        | TEST_ENV=dev                             | 模拟开发环境，例如在测试环境使用dev的配置信息                 |
| port        | port: 3002                               | 应用端口                                     |
| baseUrl     | baseUrl: process.env.BASE_URL \|\| '/jagger' | 取值 BASE_URL环境变量，打包、运行中取该环境变量确定baseUrl信息，达到灵活部署项目，例如配置为/my-project, 路由变为 http://localhost:3000/my-project/samples/hello-world |
| cdnUrl      | cdnUrl: process.env.CDN_URL \|\| '/jagger', | 取值CDN_URL环境变量，打包、运行中取该环境变量确定cdnUrl，达到灵活配置CDN路径的目的，例如配置为//cdn.gfzq.cn/jagger/develop，则图片等静态资源路径变更为//cdn.gfzq.cn/jagger/develop/views/hello-world/logo.jpg |
| assets      | assets: /\.(png\|jpe?g\|gif\|svg\|pdf\|ico)(\?.*)?$/i, | 静态资源尾缀，配置需要识别的静态文件，如匹配，则做MD5 Hash转换，并替换链接中的地址 |
| browserSync | {port: 3000,reloadDelay: 300,notify: false} | 开发模式下启用，port：Live Reload代理端口；reloadDelay：刷新delay；notify：是否提示刷新 |
| logger      | {level: 'debug',maxsize: 100 * 1024 * 1024} | level: 日志级别； maxsize文件最大值                |



## 7、组件清单

| 类型          | 选型                    | 备注                                       |
| :---------- | --------------------- | ---------------------------------------- |
| ES7         | Webpack + Babel       | 其中Server端采用babel-register、babel-polyfill实时编译运行，便于异常定位 |
| Server      | Node + Koa2           | 支持ES7                                    |
| HTML模板      | Swig                  |                                          |
| CSS预处理器     | PostCSS               | 预置precss、autoprefixer                    |
| Unit Test   | Jest                  | 支持ES7                                    |
| E2E Test    | TestCafe              | 支持ES7                                    |
| MVVM        | Vue2.0                | 预置Vue2.0，支持SSR&前后端融合，后续支持React、NG2       |
| Live Reload | Nodemon + BrowserSync | 支持Server、FE浏览器实时刷新                       |
| Build       | Gulp + Webpack        | 自定义Loader完成打包构建                          |
| Logger      | winston               | 支持daily rotate                           |



## 8、部署

由于在打包过程中部分包会读取NODE_ENV变量执行构建，所以目前Jagger仅支持dev、production两套环境变量，通过TEST_ENV变量模拟环境配置，例如设置为TEST_ENV=dev强制使用开发环境配置，以便部署测试环境。

默认使用

* npm run build 构建生产版本
* npm run production 运行生产环境

建议使用Jenkins等CI构建工具，根据项目情况动态传入配置信息，同时完成CDN资源的上传

如需构建测试环境：

* NODE_ENV=production TEST_ENV=dev BASE_URL=/my-project CDN_URL=//cdn.my-cdn.cn/my-project/develop npm run build 构建测试环境
* NODE_ENV=production TEST_ENV=dev BASE_URL=/my-project CDN_URL=//cdn.my-cdn.cn/my-project/develop  ENTRY=../dest/app.js node ./.bin/run.js 运行测试环境

>注意传入TEST_ENV=dev变量，以便在打包、运行时使用开发环境变量配置

如需构建生产环境：

- NODE_ENV=production BASE_URL=/my-project CDN_URL=//cdn.my-cdn.cn/my-project/master npm run build 构建测试环境
- NODE_ENV=production BASE_URL=/my-project CDN_URL=//cdn.my-cdn.cn/my-project/master ENTRY=../dest/app.js node ./.bin/run.js 运行测试环境

> 建议使用通过Jenkins/Docker/PM2执行部署

## 8、Q & A

待补充。






