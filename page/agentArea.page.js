import { BaseTest } from './baseTest.page'

export class AgentAreaPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.menuProfile = page.locator('.away-timer')
    this.dropDownStatus = page.locator('#toggler')
    this.chatMensagens = page.locator('[class*="smoothScroll"]')
    this.btnOpcoesConversa = page.locator('#moreOptionsButton')
    this.inputTransferSkill = page.locator('#react-select-2-input')
    this.optTransferSkill = page.locator('[id*=option]')
    this.btnTransfer = page.locator('button:visible', { hasText: 'Transferir' })
  }

  async setOnlineStatus() {
    await this.menuProfile.click()
    await this.dropDownStatus.click()
    await this.page.locator('text=Online').click()
  }

  async openChatOptions(customer) {
    console.log('Abrir lista de opções na conversa do cliente')
    await this.page.locator('h5', { hasText: customer }).click()
    await this.chatMensagens.click()
    await this.btnOpcoesConversa.click()
  }

  async transferChatToSkill(skill) {
    await this.page.getByText('ALT + T').click()
    await this.inputTransferSkill.click({ force: true })
    await this.inputTransferSkill.fill(skill)
    await this.page.locator(`[id*=option]:text("${skill}")`).click()
    await this.btnTransfer.click()
  }

  async closeConversation() {
    await this.page.getByText('Encerrar conversa').click()
    await this.page.waitForTimeout(2000)
    await this.chooseComboOption()
    await this.chooseComboOption()
    await this.chooseComboOption()
    await this.page.getByText('Confirmar Tabulação').click()
    await this.page.waitForResponse('**/change-status**')
  }
}
