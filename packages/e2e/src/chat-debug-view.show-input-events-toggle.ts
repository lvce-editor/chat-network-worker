import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-network-worker.show-input-events-toggle'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Main.openUri', 'chat-network://e2e-session-toggle')
  await expect(Locator('.chatNetWorkView')).toBeVisible()

  const events = [
    {
      sessionId: 'e2e-session-toggle',
      timestamp: '2026-03-08T00:00:00.000Z',
      type: 'handle-input',
      value: 'h',
    },
    {
      sessionId: 'e2e-session-toggle',
      timestamp: '2026-03-08T00:00:01.000Z',
      type: 'handle-submit',
      value: 'hello',
    },
    {
      sessionId: 'e2e-session-toggle',
      timestamp: '2026-03-08T00:00:02.000Z',
      type: 'handle-input',
      value: 'he',
    },
  ]
  await Command.execute('chatNetWork.setEvents', events)

  const eventNodes = Locator('.chatNetWorkViewEvent')
  const toggle = Locator('input[name="showInputEvents"]')

  // assert hidden by default
  await expect(eventNodes).toHaveCount(1)
  await expect(eventNodes.nth(0)).toContainText('"type": "handle-submit"')

  // act + assert: show input events
  await toggle.click()
  await expect(eventNodes).toHaveCount(3)

  // act + assert: hide input events again
  await toggle.click()
  await expect(eventNodes).toHaveCount(1)
}
