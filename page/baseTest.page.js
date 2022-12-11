import { expect } from '@playwright/test'
import faker from 'faker-br'

export class BaseTest {

  constructor(page) {
    this.page = page
  }

  async validateToastMessage(msg) {
    await expect(this.page.locator('.toast-message:visible')).toHaveText(msg)
  }

  async generateCustomerName() {
    const name = faker.name.findName()
    console.log(`Cliente: ${name}`)
    process.env.CUSTOMER_NAME = name
  }

  async generateCPF() {
    const cpf = faker.br.cpf()
    console.log(`CPF: ${cpf}`)
    process.env.CPF = cpf
  }

  async chooseComboOption(combo, opt) {
    if (combo)
      await this.page.locator(`div:below(:text("${combo}"))`).first().click()
    else
      await this.page.getByText('Escolher...').click()

    if (opt) {
      await this.page.locator(`input:visible:near(:text("${combo}"))`).first().fill(opt)
      await this.page.locator('[id*="option"]', { hasText: opt }).click()
    } else await this.page.locator('[id*="option-0"]').click()
  }

  async assertFieldError(field, msg) {
    await expect(this.page.locator(`.invalid-feedback:below(:text("${field}"))`).first()).toHaveText(msg)
  }
}
