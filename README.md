# Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm install
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window for default English site. Most changes are reflected live without having to restart the server.

```
$ npm run start -- --locale zh
```
This command starts a local development server and opens up a browser window for Chinese site. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.





### Document format checking

The file format check includes five types respectively:

1. Check the number of titles in both English and Chinese
2. Check the number of links in both English and Chinese
3. Check the number of highlights in both English and Chinese
4. Check struct examples in both Chinese and English
5. English word spelling check

※: The `language_tool_python` module used in Check 5 detects word spelling errors.When it detects a problem with the word, it will go to the `pre_dict.json` file to determine, so just note some special words here.
