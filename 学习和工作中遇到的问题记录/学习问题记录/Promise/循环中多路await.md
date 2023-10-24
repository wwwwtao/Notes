```js

async function printFiles () {
  const files = await getFilePaths();
  await Promise.all(files.map(async (file) => {
    const contents = await fs.readFile(file, 'utf8')
  }));
}

```