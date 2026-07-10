import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'

export default [
  ...config.default,
  ...actions.default,
  ...tsconfig.default,
  {
    files: ['packages/chat-network-worker/test/Request.test.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
    },
  },
  {
    files: ['packages/e2e/src/**/*.ts'],
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
]
