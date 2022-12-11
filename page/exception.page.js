import { BaseTest } from './baseTest.page'

export class ExceptionPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.inputSkill = page.locator('//*[contains(text(),"Habilidade")]/..//input')
    this.inputTimezone = page.locator('//*[contains(text(),"Fuso horário")]/..//input')
    this.inputName = page.locator('(//*[contains(text(),"Nome")]/../..//input)[1]')
    this.inputLineName = page.locator('//*[contains(text(),"Nome")]/../../../div[5]/div[1]/div[1]//input')
    this.inputStart = page.locator('//*[contains(text(),"Início")]/following-sibling::div/div/input')
    this.inputEnd = page.locator('//*[contains(text(),"Fim")]/following-sibling::div/div/input')
    this.btnAddException = page.getByText('Adicionar Exceção')
    this.btnEditException = page.locator('#edittooltip0')
    this.btnDeleteException = page.locator('#deletetooltip0')
    this.btnAddLine = page.getByText('Adicionar linha')
  }

  async fillQueryName() {
    // 'setar o nome na tela de consulta'
    titulo = recuperar_dados('features/arquivos/execao.txt')
    inputName.fill(titulo[0].to_s)
  }

  async fillName() {
    // 'setar o nome da exeção'
    titulo = recuperar_dados('features/arquivos/execao.txt')
    inputName.fill(titulo[0].to_s)
  }

  async findException(exceptionName) {
    await this.inputName.fill(exceptionName)
    await this.page.getByText('Buscar').click()
    // sleep(3)
  }

  async deleteException() {
    await this.btnDeleteException.click()
    await this.page.getByText('Sim').click()
    await this.validateToastMessage('Exceção deletada')
  }

  async confirmException() {
    await this.page.getByText('Confirmar').click()
    await this.validateToastMessage('Exceção adicionada')
  }

  async fillException() {
    // 'informar dados da exeção'
    // variavel = %w[abb aaa fgj fgy wsdl mva xfb]
    i = rand(6)
    // sleep 1
    await this.inputName.fill("Exceção Teste Automatizado #{variavel[i]}")
    await this.inputName.press('enter')
    // sleep 2
    // msg = "Exceção Teste Automatizado #{variavel[i]}"
    // gravar_dados('features/arquivos/execao.txt', msg)
    await this.inputTimezone.fill('America/Sao Paulo')
    await this.inputTimezone.press('enter')
    // sleep 2
    await this.inputSkill.fill('TESTE_AUTOMACOES')
    await this.inputSkill.press('enter')
    // sleep 2
    await this.inputLineName.fill('teste execao um')
    // sleep 2
    await this.inputStart.fill('09/06/2025 00:00:00')
    await this.inputEnd.fill('09/06/2025 23:59:59')
    await this.inputEnd.press('enter')
    // sleep 2
    await this.btnAddLine.click()
  }

  async fillDefaultException(skillName) {
    const date = new Date()
    const date1 = new Date(date.setSeconds(date.getSeconds() + 10))
    const date2 = new Date(date.setMinutes(date.getMinutes() + 5))
    await this.btnAddException.click()
    await this.page.waitForTimeout(2000)
    await this.inputName.fill(`Exceção para skill ${skillName}`)
    await this.chooseComboOption('Fuso horário', 'America/Sao Paulo')
    await this.chooseComboOption('Habilidade', skillName)
    await this.inputSkill.fill(skillName)
    await this.inputLineName.fill('Teste de Exceção')
    await this.inputStart.fill(date1.toLocaleString('pt-BR'))
    await this.inputStart.press('Enter')
    await this.page.waitForTimeout(1000)
    await this.inputEnd.fill(date2.toLocaleString('pt-BR'))
    await this.inputEnd.press('Enter')
    await this.page.waitForTimeout(1000)
    await this.btnAddLine.click()
    await this.page.waitForTimeout(1000)
    await this.confirmException()
  }
}
