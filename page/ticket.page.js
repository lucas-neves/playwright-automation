import { BaseTest } from './baseTest.page'
import { expect } from '@playwright/test'

export class TicketPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.inputCpf = page.getByPlaceholder('Insira o CPF')
    this.inputCardLastDigits = page.getByPlaceholder('Insira os últimos 4 dígitos do cartão (opcional)')
    this.inputEmail = page.getByPlaceholder(/Insira o (e-mail|email)/)
    this.inputCardOwner = page.getByPlaceholder('Insira o nome do titular do cartão')
    this.btnNext = page.getByRole('button', { name: 'Próximo' })
  }

  async goToTicket(ticket) {
    await this.page.goto(`https://company.azurestaticapps.net/${ticket}`)
  }

  async desacordoFirstStep() {
    await this.generateCPF()
    await this.inputCpf.fill(process.env.CPF)
    await this.inputCardLastDigits.fill('5141')
    await this.inputEmail.fill(`${process.env.CPF}@user.com`)
    await this.generateCustomerName()
    await this.inputCardOwner.fill(process.env.CUSTOMER_NAME)
    await this.btnNext.click()
  }

  async desacordoSecondStep() {
    await this.page.getByLabel('Mercadoria').check()
    await this.page.getByPlaceholder('Selecione o sub assunto da contestação').click()
    await this.page.getByRole('button', { name: 'Mercadoria com defeito' }).click()
    await this.page.getByLabel('1 transação').check()
    await this.btnNext.click()
  }

  async desacordoThirdStep() {
    await this.page.getByRole('button', { name: 'Choose date' }).first().click()
    await this.page.getByRole('button', { name: 'Oct 18, 2022' }).press('Enter')
    await this.page.getByPlaceholder('Insira o estabelecimento').fill('Teste')
    await this.page.getByPlaceholder('Insira o valor da compra em reais').fill('99')
    await this.page.getByPlaceholder('Insira o valor da compra em dólares (opcional)').fill('99')
    await this.page.getByPlaceholder('Insira qual foi a mercadoria adquirida').fill('Teste')
    await this.page.getByRole('button', { name: 'Choose date' }).click()
    await this.page.getByRole('button', { name: 'Oct 18, 2022' }).press('Enter')
    await this.page.getByPlaceholder('Insira o endereço de entrega da mercadoria').fill('Teste')
    await this.page.getByPlaceholder('Insira os detalhes sobre o ocorrido').fill('Teste')
    await this.page.getByLabel('Estou em posse da mercadoria e ela está disponível para ser retirada pelo estabelecimento').check()
    await this.page.getByPlaceholder('Insira o nome do estabelecimento, ou no caso de contratação via internet, o site').fill('Teste')
    await this.page.getByLabel('Não').check()
    await this.page.getByPlaceholder('Insira o motivo').fill('Teste')
    await this.page.getByRole('button', { name: 'Finalizar' }).click()
    await expect(this.page).toHaveURL(new RegExp('https://company.azurestaticapps.net/share'))
  }
}
