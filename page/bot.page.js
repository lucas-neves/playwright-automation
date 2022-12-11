import { expect } from '@playwright/test'
import { BaseTest } from './baseTest.page'

export class BotPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.inputChat = this.page.locator('#text-input input')
    this.btnSend =  this.page.locator('[type=submit]')
    this.btnCloseConversation =  this.page.locator('#close-livechat')
  }

  async goToBotTab() {
    await this.page.goto(process.env.BOT_URL)
  }

  async validateBotMessage(msg) {
    await expect(this.page.locator(`text=${msg}`)).toBeVisible()
  }

  async fillName() {
    this.generateCustomerName()
    await this.inputChat.fill(process.env.CUSTOMER_NAME)
    await this.btnSend.click()
  }

  async sendMessage() {
    await this.inputChat.fill('Mensagem bot')
    await this.btnSend.click()
  }

  async selectChannel() {
    await this.page.locator('text=Testes Automatizados').click()
  }

  async closeConversation() {
    await this.btnCloseConversation.click()
  }
}
