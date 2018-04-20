# Develop

Environment:

- https://nodejs.org/en/download/
- https://yarnpkg.com/en/docs/install
- https://code.visualstudio.com/Download

Install:

```bash
git clone https://github.com/FlamingoVapor/starry-night
cd starry-night
yarn
yarn start

# Please auto format JS before every commit.
yarn format
```

Deploy:

```bash
# In same dir where you ran `yarn start`
rm -rf dist
git clone -b gh-pages https://github.com/FlamingoVapor/starry-night dist
yarn deploy
```

Find source code under `src/`, organized by feature.

### `src/app/`

Services contain logic.

### `src/domain/`

Entities declare data shape and defaults.