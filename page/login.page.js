import { BaseTest } from './baseTest.page'
import { expect } from '@playwright/test'

export class LoginPage extends BaseTest {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page)
    this.inputDominioEmpresa = page.locator('#slug')
    this.inputEmail = page.locator('#email')
    this.inputSenha = page.locator('#password')
    this.btnEntrar = page.locator('button[type="submit"]')
    this.textEsqueciMinhaSenha = page.locator('a[class="text-muted"]')
  }

  async doLoginAdmin(email) {
    await this.inputDominioEmpresa.fill('porto')
    await this.inputEmail.fill(email)
    await this.inputSenha.fill(process.env.PASSWORD)
    await this.btnEntrar.click()
    await expect(this.page).toHaveURL(`${process.env.BASE_URL}/dashboard`)
  }
}