const fs = require("fs");
const path = require("path");
const markdown = require("markdown-it")();

const contentDir = "../content";
const postsDir = "../blog/posts";

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Read all markdown files
fs.readdirSync(contentDir).forEach((file) => {
  const filePath = path.join(contentDir, file);
  if (path.extname(file) === ".md") {
    // Convert to html
    const mdContent = fs.readFileSync(filePath, "utf8");
    const htmlContent = markdown.render(mdContent);
    const postName = file.replace(".md", "").replace(/-/g, " ");

    const blogPostTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${postName}</title>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
    `;

    // Write to output directory
    const buildFilePath = path.join(
      postsDir,
      path.basename(file, ".md") + ".html",
    );
    fs.writeFileSync(buildFilePath, blogPostTemplate);
  }
});
