# smart-import

### 故事背景

**前情提要**：[自动 Import 工具，前端打字员的自我救赎 ](https://segmentfault.com/a/1190000012792016)

#### smart-import 的功能

根据配置文件，在目标文件中自动导入规定目录下自定义模块，并监听规定目录下文件的变动，自动更新

尚在测试中

#### smart-import 的使用

安装工具

```
npm install smart-import -g
```

编写配置文件`smart-import.json`

```
{
    "extname": ".vue",
    "from": "demo/pages",
    "to": "demo/router/index.js",
    "template": "const moduleName = () => import(modulePath)",
    "ignored": [
        "demo/pages/pageA.vue",
        "demo/pages/**/*.js"
    ]
}
```

**extname**：需要自动导入的模块的后缀名

**from**：自动导入的模块的来源目录

**to**：目标文件

**template**：导入方式的模版

**ignored**：需要忽略的模块

启动工具

在命令行输入

```
simport
```

**smart-import 的诞生**

smart-import作为命令行工具，和平常写网站还是有些不同的。

同样的部分，github建仓库，npm init

通过`npm init`会生成`package.json`文件，其中**main**字段的作用在于，如果你的代码最终作为一个模块被其他人import/require，那么这个文件就是这个模块的入口文件，可以参考[node加载模块的机智](http://nodejs.cn/api/modules.html#modules_all_together)

摘自[npm官方文档](https://docs.npmjs.com/files/package.json)

> The main field is a module ID that is the primary entry point to your program. That is, if your package is named `foo`, and a user installs it, and then does `require("foo")`, then your main module's exports object will be returned.
>
> This should be a module ID relative to the root of your package folder.
>
> For most modules, it makes the most sense to have a main script and often not much else.

由于smart-import是一个命令行工具，并不会被其他人import/require，所以**main**字段可以忽略；而要注意的是**bin**字段

```
"bin": {
    "simport": "./bin/index.js"
 },
```

摘自[npm官方文档](https://docs.npmjs.com/files/package.json)

> A lot of packages have one or more executable files that they'd like to install into the PATH. npm makes this pretty easy (in fact, it uses this feature to install the "npm" executable.)
>
> To use this, supply a `bin` field in your package.json which is a map of command name to local file name. On install, npm will symlink that file into `prefix/bin` for global installs, or `./node_modules/.bin/` for local installs.

简单来说，就是将你的脚本放到环境变量中

而在你的脚本的第一行务必要加上

```
#!/usr/bin/env node
```

用于告诉计算机用 node 来运行这段脚本

在测试自己的脚本之前要把运行

```
npm install -g
```

把自己的脚本链接到环境变量中，不然会被告知该命令不存在

**smart-import 的发布**

先要有npm的账号

然后给package添件账号

```
npm adduser
```

之后可以通过`npm whoami`来核实自己的账号信息

最后就是

```
npm publish
```

版本更新

```
npm version patch
npm publish
```





### 参考资料

https://docs.npmjs.com/files/package.json

https://developer.atlassian.com/blog/2015/11/scripting-with-node/

https://javascriptplayground.com/node-command-line-tool/

https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/