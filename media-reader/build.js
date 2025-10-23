const fs = require("fs");
const path = require("path");

// 读取public文件夹结构
const publicDir = path.join(__dirname, "public");
function readDirRecursive(dir) {
  const res = { name: path.basename(dir), children: [], files: [] };

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      res.children.push(readDirRecursive(filePath));
    } else {
      res.files.push(path.relative(__dirname, filePath).replace(/\\/g, "/"));
    }
  });
  return res;
}

const menus = readDirRecursive(publicDir);

fs.readFile(path.join(__dirname, "template.html"), "utf8", (err, data) => {
  // 使用replace方法替换目标模板
  const newData = data.replace(
    /{{\s*template\s*}}/g,
    JSON.stringify(menus, null, 2)
  );

  // 将更新后的内容写回文件
  fs.writeFile(path.join(__dirname, "dist.html"), newData, (writeErr) => {});
});
