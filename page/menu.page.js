import { BaseTest } from './baseTest.page'
import { expect } from '@playwright/test'

export class MenuPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.menuAgentArea = page.locator('.bx-chat')
    this.menuManagerArea = page.locator('.bx-layout')
    this.menuSkills = page.locator('.bx-bookmark')
    this.menuException = page.locator('.mdi-calendar-remove-outline')
    this.menuTabs = page.locator('.mdi-table')
  }

  async clickAgentAreaMenu() {
    await this.menuAgentArea.click()
    await expect(this.page).toHaveURL(`${process.env.BASE_URL}/chats`)
  }

  async clickManagerAreaMenu() {
    await this.menuManagerArea.click()
    await expect(this.page).toHaveURL(`${process.env.BASE_URL}/manager-panel`)
  }

  async clickSkillsMenu() {
    await this.menuSkills.click()
    await expect(this.page).toHaveURL(`${process.env.BASE_URL}/skills`)
  }

  async clickExceptionMenu() {
    await this.menuException.click()
    await expect(this.page).toHaveURL(`${process.env.BASE_URL}/exceptions`)
  }

  async clickTabsMenu() {
    await this.menuTabs.click()
    await expect(this.page).toHaveURL(`${process.env.BASE_URL}/tabs`)
  }
}
