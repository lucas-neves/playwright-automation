import { test } from '../support/fixture'

test.describe('@tabulacoes', () => {

  test('[8028] - Incluir tabulações', async ({ loginAdmin, menuPage, tabsPage }) => {
    // Dado que o admin esteja logado no site
    await menuPage.clickTabsMenu()

    // Quando adiciona uma nova tabulação
    await tabsPage.btnAddTab.click()
    await tabsPage.fillTabData()

    // Então sistema exibe mensagem de sucesso na inclusão
    await tabsPage.validateToastMessage('Tabulação adicionada com sucesso')
  })

  test('[8029] - Validar dados obrigatórios tabulações', async ({ loginAdmin, menuPage, tabsPage }) => {
    // Dado que o admin esteja logado no site
    await menuPage.clickTabsMenu()

    // Quando inicio a criação de uma nova tabulação
    await tabsPage.btnAddTab.click()

    // Então tela exibe erros de obrigatoriedade
    await tabsPage.assertRequiredFields()
  })

  test('[8030] - Alterar tabulações', async ({ loginAdmin, menuPage, tabsPage }) => {
    // Dado que o admin esteja logado no site
    await menuPage.clickTabsMenu()

    // Quando edita uma tabulação
    await tabsPage.searchTab()
    await tabsPage.editTab()

    // Então sistema exibe mensagem de sucesso na atualização
    await tabsPage.validateToastMessage('Tabulação atualizada com sucesso')
  })

  test('[8031] - Deletar tabulações', async ({ loginAdmin, menuPage, tabsPage }) => {
    // Dado que o admin esteja logado no site
    await menuPage.clickTabsMenu()

    // Quando deleta uma tabulação
    await tabsPage.searchTab()
    await tabsPage.deleteTab()

    // Então sistema exibe mensagem de sucesso na exclusão
    await tabsPage.validateToastMessage('Tabulação deletada com sucesso')
  })
})
