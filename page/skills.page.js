import { BaseTest } from './baseTest.page'

export class SkillsPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.inputName = page.locator('#name')
    this.btnSearch = page.locator('[type=submit]')
    this.btnEdit = page.locator('#edittooltip0')
    this.btnConfirm = page.locator('button[type="submit"]')
    this.selectWorkWeekday = page.locator('//*[@class="customButtonDatepicker dropdown-toggle btn btn-light"]')
    this.inputStartDayTime = page.locator('#startField')
    this.inputEndDayTime = page.locator('#endField')
    this.selectStartWorkTime = page.locator('//*[contains(text(), "12:00 AM")]')
    this.selectEndWorkTime = page.locator('//*[contains(text(), "12:15 AM")]')
    this.btnDeleteWorkDay = page.locator('//*[contains(text(), "Deletar")]')
    this.btnAddWorkDay = page.locator('#skill-work-days+div button.btn-success')
  }

  async editSkill(skill) {
    await this.inputName.fill(skill)
    await Promise.all([
      this.page.waitForResponse(async resp => resp.url().includes('/skill?filter') && resp.status() === 200 && (await resp.json()).data.total === '1'),
      this.btnSearch.click()
    ])
    await this.btnEdit.click()
  }

  async confirmSkillEdit() {
    await this.btnConfirm.click()
    await this.validateToastMessage('Habilidade atualizada com sucesso')
  }

  async skillOutOfWorkTime() {
    // Configurando skill para estar fora do horário de atendimento'
    const dayOfWeekName = new Date().toLocaleString(
      'pt-BR', { weekday: 'long' }
    )
    await this.selectWorkWeekday.click()
    await this.page.getByText(dayOfWeekName).click()
    await this.inputStartDayTime.click()
    await this.selectStartWorkTime.click()
    await this.page.waitForTimeout(1000)
    await this.inputEndDayTime.click()
    await this.selectEndWorkTime.click()
    await this.page.waitForTimeout(1000)
    await this.btnAddWorkDay.click()
  }
}
