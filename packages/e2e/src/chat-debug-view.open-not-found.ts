import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-network-view.open-not-found'

export const test: Test = async ({ Command, expect, Locator }) => {
  // act
  await Command.execute('Main.openUri', 'chat-network://not-found')

  // assert
  const errorMessage = Locator('.chatNetWorkViewError')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText('No chat session found for sessionId "not-found".')
}
