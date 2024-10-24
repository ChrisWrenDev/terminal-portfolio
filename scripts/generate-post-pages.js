const fs = require("fs");
const path = require("path");
const markdown = require("markdown-it")();

const contentDir = path.join(__dirname, "../", "content");
const postsDir = path.join(__dirname, "../", "blog");

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
    <html lang="en-GB" data-theme="light">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${postName}</title>
      <link
        rel="stylesheet"
        type="text/css"
        media="screen"
        href="../styles/style.css"
      />
    </head>
    <body>
    <div id="content" class="content">
       <header class="header">
        <nav id="menu" class="menu">
          <ul class="menu__list">
            <li class="menu__item">
              <a href="/" class="link">Home</a>
            </li>
            <li class="menu__item">
              <a href="/blog" class="link">Blog</a>
            </li>
          </ul>
        </nav>
        <div class="toggle__container">
          <input type="checkbox" id="toggle" class="toggle__checkbox" />
          <label for="toggle" class="toggle__label">
            <div class="toggle__inner"></div>
          </label>
        </div>
      </header>
      ${htmlContent}
      </div>
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
