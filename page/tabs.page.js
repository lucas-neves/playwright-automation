import { BaseTest } from './baseTest.page'
import { expect } from '@playwright/test'
import faker from 'faker-br'

export class TabsPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.inputSearchTab = page.locator('[name=name]')
    this.tblTabs = page.locator('.table tbody tr')
    this.btnEdit = page.locator('#edit')
    this.btnDelete = page.locator('#deletetooltip0')
    this.btnAddTab = page.locator('#new-Tab button')
    this.inputTabName = page.locator('#tab-name-label+div input')
    this.btnAddSubitem = page.locator('#tab-name-label+div .btn-success')
    this.btnDeleteItem = page.locator('#tab-name-label+div .btn-danger')
    this.cbxGlobal = page.locator('label:text("Global")')
    this.selectSkill = page.locator('input[id*=select]')
    this.btnConfirm = page.locator('button[type="submit"]')
  }

  async searchTab() {
    await this.page.waitForResponse('**/tab?**')
    await this.inputSearchTab.fill('Tab teste automação')
    await this.btnConfirm.click()
    await this.page.waitForResponse('**/tab?**')
    await expect(this.tblTabs.first()).toContainText('automação')
  }

  async fillTabData() {
    const num = faker.random.number(9999)
    await this.inputTabName.fill(`Tab teste automação ${num}`)
    await this.cbxGlobal.click()
    await this.selectSkill.fill('TESTE_AUTOMACOES')
    await this.page.waitForTimeout(2000)
    await this.selectSkill.press('Enter')
    await this.btnConfirm.click()
  }

  async editTab() {
    await this.btnEdit.first().click()
    await this.selectSkill.fill('CHAT_NUCLEO_AUTO')
    await this.page.waitForTimeout(2000)
    await this.selectSkill.press('Enter')
    await this.selectSkill.fill('AUTO_PANE_NF')
    await this.page.waitForTimeout(2000)
    await this.selectSkill.press('Enter')
    await this.btnConfirm.click()
  }

  async deleteTab() {
    await this.btnDelete.first().click()
    await this.page.locator('button', { hasText: 'Sim' }).click()
  }

  async assertRequiredFields() {
    await this.cbxGlobal.click()
    await this.assertFieldError('Nome', 'Minimo 3 caracteres')
    await this.assertFieldError('Habilidade', 'Selecione uma habilidade ou habilite o modo global')
  }
}
