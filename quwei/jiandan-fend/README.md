build/ config/ 都是脚手架的配置代码，一般不用修改

src/ 存放真正项目源码的地方

static/ 存放不会被修改的静态资源，css，js，img

.babelrc 将项目里面高版本的js代码语法(es6,7,typescript)切换为为低版本的es5语法

.editorconfig 给开发工具看的，约束编码规范

.eslintignore 告诉eslint忽略对配置文件中的文件进行代码和语法的检查

.eslintrc eslint 配置文件

.gitignore git 上传文件时候需要忽略的文件列表

postcss css的一款自动化插件

assets/ 存放网站的资源文件

components/ 存放网站的所有页面

router/ 存放vue-router 的路由配置文件

App.vue 页面最外层的顶级父组件

main.js 程序的核心入口文件，一般安装一些vue插件，ui框架，全局方法变量就在这里配置

组件通讯：

 1：父 -> 子 props
 2：子 -> 父 $emit()
 3：飞父子关系 $parent, $root, $children