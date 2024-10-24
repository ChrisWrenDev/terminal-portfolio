const fs = require("fs");
const path = require("path");

const postDir = path.join(__dirname, "../", "blog");
const blogIndexFile = path.join(__dirname, "../", "blog", "index.html");

if (!fs.existsSync(postDir)) {
  fs.mkdirSync(postDir, { recursive: true });
}

const postFiles = fs
  .readdirSync(postDir)
  .filter((file) => file.endsWith(".html"))
  .map(
    (file) => `<div class="post">
          <a href="./${file}" class="post__title-link">
            <h2 class="post__title">${file.replace(".html", "").replace(/-/g, " ")}</h2>
          </a>
          <p class="post__meta">
            <span class="post__date">December 25th 2019</span> |
            <span class="post__tag" data-filter="Dark">#Tag1</span>
            <span class="post__tag" data-filter="Sidebar">#Tag2</span>
          </p>
          <p class="post__excerpt">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </p>
          <a href="./${file}" class="link">Read More &gt;</a>
          <hr class="divider" />
        </div>`,
  )
  .join("\n");

const blogIndexTemplate = `
<!DOCTYPE html>
<html lang="en-GB" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Chris Wren | Blog</title>
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
      <section class="section">
        <p>Welcome to the blog! Here’s where I spill the beans on my coding adventures, from dodging bugs to building (and sometimes breaking) cool stuff. Whether it’s the latest project, a nifty hack, or a hot take on tech trends, this is where you’ll find the unfiltered story. So grab a coffee (or a pint), kick back, and let’s talk code!</p>
        </section>
        <hr class="divider"/>
        <section class="section">
        <form action="" class="form-group">
          <input
            type="search"
            name="search"
            placeholder="Search"
            value=""
            class="search"
          />
        </form>

        <a class="link" href="/simple-blog-with-search"
          ><strong>Show all</strong></a
        >
        |
        <a class="link" href="?filter=Dark"> #Tag1 </a>
        <a class="link" href="?filter=Light"> #Tag2 </a>
      </section>
      <hr class="divider" />
      <section id="posts" class="section">
        ${postFiles}
      </section>
    </div>
    <script src="../scripts/commands.js"></script>
    <script src="../scripts/main.js"></script>
  </body>
</html>

`;

fs.writeFileSync(blogIndexFile, blogIndexTemplate);
