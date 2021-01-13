# 使用说明
针对多个output场景，将splitChunk产生的css合并到每个output的css文件中，保证每个output都只输出一个css文件。支持引入不同构建流程的资源，如通过DllPlugin生成的资源

# 使用文档
```js
const config = {
  // output列表，一级路径，带css后缀，例如['ide.css']
  entries: Array<string>,
  // 需要合并的资源列表，一级路径，带css后缀，例如['vendor.css', 'common.css', {type: 'external', path: 其他构建产物的完整路径}]
  outputPrefix: Array<string | { type: 'external' | 'internal', path: string}>,
}
```
