const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        background: './windows/background/background.tsx',
        desktop: './windows/desktop/desktop.tsx',
        in_game: './windows/in_game/in_game.tsx'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', ".jsx", ".tsx", ".js"]
    },
    output: {
      path: `${__dirname}/dist`,
      filename: '[name]/[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './windows/background/background.html',
            filename: `${__dirname}/dist/background/background.html`,
            chunks: ['background']
        }),
        new HtmlWebpackPlugin({
            template: './windows/desktop/desktop.html',
            filename: `${__dirname}/dist/desktop/desktop.html`,
            chunks: ['desktop']
        }),
        new HtmlWebpackPlugin({
            template: './windows/in_game/in_game.html',
            filename: `${__dirname}/dist/in_game/in_game.html`,
            chunks: ['in_game']
        })
    ]
}