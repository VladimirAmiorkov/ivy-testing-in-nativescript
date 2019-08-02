module.exports = {
    entryPoints: {
        '.':
        {
            override:
            {
                main: "./index.js",
                typings: "./index.d.ts"
            }
        },
        './directives':
        {
            override:
            {
                main: "./index.js",
                typings: "./index.d.ts"
            }
        }
    }
}