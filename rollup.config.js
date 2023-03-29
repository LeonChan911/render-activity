import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'client/index.js',
  output: {
    file: 'dist/shell.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      presets: [
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    }),
    commonjs(),
  ],
};
