import { BaseTest } from './baseTest.page'
import { expect } from '@playwright/test'

export class ManagerAreaPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.selectSkill = page.locator('//*[contains(text(), "habilidades")]')
    this.btnFilter = page.locator('//*[@id="layout-wrapper"]/div[2]/div/div[1]/div//div[4]/div/div/button')
    this.btnFilterManagerPanel = page.locator('//*[@class="d-flex justify-content-end m-2"]/button[2]')
    this.btnTransfer = page.locator('//*[@id="tooltiptransfer"]')
    this.btnClose = page.locator('//*[@id="tooltipclose"]')
    this.btnCloseConversation = page.locator('//*[@id="tooltipclose0"]')
    this.btnSearchManagerPanel = page.locator('button[id="manager-filter-button"]')
    this.btnConfirm = page.locator('button[type="submit"]')
    this.textConversationsReceived = page.locator('#receivedTitle+div')
    this.inputClientFilter = page.locator('//*[@class="card-body"]/div[1]/div[4]/div[1]/div[2]/input[1]')
  }

  async validateChatList(customer) {
    await this.btnFilterManagerPanel.click()
    await this.inputClientFilter.fill(customer)
    await this.btnSearchManagerPanel.click()
    await this.page.locator('#tooltipname0', { hasText: customer })
  }

  async validateMetric(number) {
    const num = parseInt(number) + 1
    await this.page.goto('/manager-panel')
    await this.page.waitForResponse('**/manager-activities')
    expect(await this.textConversationsReceived.textContent()).toBe(num.toString())
  }

  async closeTableConversation() {
    await this.btnCloseConversation.click()
    await this.page.waitForTimeout(2000)
    await this.chooseComboOption()
    await this.chooseComboOption()
    await this.chooseComboOption()
    await this.btnConfirm.click()
    await this.page.waitForResponse('**/change-status**')
  }
}
