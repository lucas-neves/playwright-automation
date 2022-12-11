import { test } from '../support/fixture'

test('Criar Tickets', async ({ page, ticketPage }) => {
  await ticketPage.goToTicket('desacordo')
  await ticketPage.desacordoFirstStep()
  await ticketPage.desacordoSecondStep()
  await ticketPage.desacordoThirdStep()

  const ticketProtocol = await page.locator('p', { hasText: new RegExp('[0-9]{17}') }).textContent()
  console.log(`${ticketProtocol} - ${process.env.CPF} - ${process.env.CUSTOMER_NAME}`)
})
