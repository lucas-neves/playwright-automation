import { test } from '../support/fixture'
import { LoginPage } from '../page/login.page'
import { MenuPage } from '../page/menu.page'

test.skip('Envio das mensagens "Esperando por Atendimento", "Na Fila" e "Atendimento Indisponível"', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const menuPage = new MenuPage(page)

  // Dado que o gestor esteja logado no site
  await page.goto('/')
  await loginPage.doLoginAdmin('testesautomatizados@company.com.br')
  await menuPage.clickManagerAreaMenu()
  await page.waitForResponse('**/manager-skills')

  await page.locator('#current-agents-number').click()
  await page.waitForResponse('**/manager-agents')
  
  await page.locator('#current-conversations-number').click()
  await page.waitForResponse('**/manager-conversations**')
})
