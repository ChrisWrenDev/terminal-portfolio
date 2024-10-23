const fs = require("fs");

const postDir = "../blog/posts";
const blogIndexFile = "../blog/index.html";

if (!fs.existsSync(postDir)) {
  fs.mkdirSync(postDir, { recursive: true });
}

const postFiles = fs
  .readdirSync(postDir)
  .filter((file) => file.endsWith(".html"))
  .map(
    (file) =>
      `<li><a href="./posts/${file}">${file.replace(".html", "").replace(/-/g, " ")}</a></li>`,
  )
  .join("\n");

const blogIndexTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chris Wren | Blog</title>
</head>
<body>
    <h1>Blog</h1>
    <ul>
        ${postFiles}
    </ul>
</body>
</html>
`;

fs.writeFileSync(blogIndexFile, blogIndexTemplate);
