import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'

rollup({
  entry: 'src/index.js',
  plugins: [
    babel()
  ]
})
