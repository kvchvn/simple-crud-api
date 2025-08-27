import path from 'node:path';
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';

export default {
    entry: './src/index.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
    },
    mode: isProduction ? 'production' : 'development',
    externalsPresets: { node: true },
    plugins: [],
    module: {
        rules: [{ test: /\.ts$/, use: 'ts-loader' }],
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
};
