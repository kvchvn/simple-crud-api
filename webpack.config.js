import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  context: resolve(__dirname, 'src'),
  entry: './index.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.cjs',
  },
  target: 'node',
  mode: 'production',
  resolve: {
    extensionAlias: {
      '.js': ['.js', '.ts', '.tsx'],
    },
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
};
