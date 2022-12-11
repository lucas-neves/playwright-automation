import { test } from '../support/fixture'
import { BotPage } from '../page/bot.page'

test.describe('@all @mensagensAutomaticas', () => {

  test('[11272] - Envio das mensagens "Esperando por Atendimento", "Na Fila" e "Atendimento Indisponível"', async ({ page, loginAdmin, menuPage, managerPage }) => {
    // Dado que o gestor esteja logado no site
    await menuPage.clickManagerAreaMenu()
    await page.waitForResponse('**/manager-activities')
  
    // E confira o valor da métrica de Recebidas do Manager Panel
    const received = await managerPage.textConversationsReceived.textContent()
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
    await botPage.validateBotMessage('Recebemos sua mensagem. Por favor, aguarde alguns instantes enquanto procuramos um atendente.')
    await botPage.validateBotMessage('Você está na fila para atendimento, por favor, aguarde até que um de nossos colaboradores esteja disponível.')
    await botPage.validateBotMessage('Sinto muito, mas não temos nenhum atendente online neste momento.')
  
    // Então a conversa deve estar presente no painel do gestor
    // E a métrica será incrementada
    await page.bringToFront()
    await managerPage.validateMetric(received)
    await managerPage.validateChatList(process.env.CUSTOMER_NAME)
  
    // E é preciso encerrar a conversa criada
    await managerPage.closeTableConversation()
    await managerPage.validateToastMessage('Conversa finalizada')
    await page2.bringToFront()
    await botPage.validateBotMessage('Sua conversa foi encerrada por um supervisor.')
  })
  
  test('[11273] - Envio da mensagem "Fora do horário"', async ({ page, loginAdmin, menuPage, skillsPage }) => {
    // Dado que o gestor esteja logado no site
    await menuPage.clickSkillsMenu()
  
    // E que a skill "Automated Tests" esteja configurada para fora do horário atual
    await skillsPage.editSkill('Automated Tests')
    await skillsPage.skillOutOfWorkTime()
    await skillsPage.confirmSkillEdit()
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
  
    // Então o bot informa que não pode atender a habilidade no momento
    await botPage.validateBotMessage('Sinto muito, mas não podemos atender esta habilidade neste horário')
  
    // E é preciso excluir o horário de atividade semanal da skill "Automated Tests"
    await page.bringToFront()
    await skillsPage.editSkill('Automated Tests')
    await skillsPage.btnDeleteWorkDay.click()
    await skillsPage.confirmSkillEdit()
  })
  
  test('[11274] - Envio da mensagem "Dia de exceção"', async ({ page, loginAdmin, menuPage, exceptionPage }) => {
    // Dado que o gestor esteja logado no site
    await menuPage.clickExceptionMenu()
  
    // E que a skill "Automated Tests" esteja configurada em feriado no dia atual
    await exceptionPage.fillDefaultException('Automated Tests')
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
  
    // Então o bot informa que não pode atender a habilidade no momento
    await botPage.validateBotMessage('Sinto muito, mas não podemos atender esta habilidade neste dia')
  
    // E é preciso excluir o cadastro de exceção da skill "Automated Tests"
    await page.bringToFront()
    await exceptionPage.findException('Automated Tests')
    await exceptionPage.deleteException()
  })
  
  test('[11275] - Envio da mensagem "Notificação de inatividade na fila"', async ({ page, loginAdmin, menuPage, managerPage }) => {
    test.setTimeout(240000)
    // Dado que o gestor esteja logado no site
    await menuPage.clickManagerAreaMenu()
    await page.waitForResponse('**/manager-activities')
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
    await botPage.validateBotMessage('Recebemos sua mensagem. Por favor, aguarde alguns instantes enquanto procuramos um atendente.')
    await botPage.validateBotMessage('Você está na fila para atendimento, por favor, aguarde até que um de nossos colaboradores esteja disponível.')
  
    // Então o sistema exibirá a mensagem de ociosidade
    await page.waitForTimeout(120000)
    await botPage.validateBotMessage('Olá cliente, aguarde um pouco mais, logo iremos atendê-lo.')
  
    // E a conversa deve estar presente no panel do gestor
    await page.bringToFront()
    await managerPage.validateChatList(process.env.CUSTOMER_NAME)
  
    // E é preciso encerrar a conversa criada
    await managerPage.closeTableConversation()
    await managerPage.validateToastMessage('Conversa finalizada')
    await page2.bringToFront()
    await botPage.validateBotMessage('Sua conversa foi encerrada por um supervisor.')
  })
  
  test('[11276] - Envio da mensagem "Fora da fila"', async ({ page, loginAgent, menuPage, agentPage }) => {
    // Dado que o agente esteja online no site
    await menuPage.clickAgentAreaMenu()
    await agentPage.setOnlineStatus()
    await page.waitForResponse('**/conversation?')
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
    await botPage.validateBotMessage('Um atendente (Testes Automatizados Agente) está disponível e você será atendido logo em seguida.')
  
    // E encerra a conversa via agente
    await page.bringToFront()
    await agentPage.openChatOptions(process.env.CUSTOMER_NAME)
    await agentPage.closeConversation()
  
    // Então valida as mensagens de encerramento
    await agentPage.validateToastMessage('Atendimento finalizado')
    await page2.bringToFront()
    await botPage.validateBotMessage('Sua conversa foi encerrada pelo atendente.')
  })
  
  test('[11278] - Envio da mensagem "Notificação de inatividade do agente"', async ({ page, loginAgent, menuPage, agentPage }) => {
    test.setTimeout(240000)
    // Dado que o agente esteja online no site
    await menuPage.clickAgentAreaMenu()
    await agentPage.setOnlineStatus()
    await page.waitForResponse('**/conversation?')
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
    await botPage.validateBotMessage('Um atendente (Testes Automatizados Agente) está disponível e você será atendido logo em seguida.')
  
    // Então o sistema exibirá a mensagem de inatividade do agente
    await botPage.sendMessage()
    await page.waitForTimeout(140000)
    await botPage.validateBotMessage('Aguarde mais um pouco, estou verificando algumas informações.')
  
    // E encerra a conversa via agente
    await page.bringToFront()
    await agentPage.openChatOptions(process.env.CUSTOMER_NAME)
    await agentPage.closeConversation()
  
    // E valida as mensagens de encerramento
    await agentPage.validateToastMessage('Atendimento finalizado')
    await page2.bringToFront()
    await botPage.validateBotMessage('Sua conversa foi encerrada pelo atendente.')
  })

  test('[10653] - Envio das mensagens "Transferência por habilidade" e "Transferência para habilidade pelo supervisor"', async ({ page, loginAgent, menuPage, agentPage }) => {
    // Dado que o agente esteja online no site
    await menuPage.clickAgentAreaMenu()
    await agentPage.setOnlineStatus()
    await page.waitForResponse('**/conversation?')
  
    // Quando inicia um novo atendimento no bot
    let page2 = await page.context().newPage()
    const botPage = new BotPage(page2)
    await botPage.goToBotTab()
    await botPage.fillName()
    await botPage.selectChannel()
    await botPage.validateBotMessage('Um atendente (Testes Automatizados Agente) está disponível e você será atendido logo em seguida.')
  
    // Então faz a transferência do atendimento para a skill destino "Automated Tests"
    await page.bringToFront()
    await agentPage.openChatOptions(process.env.CUSTOMER_NAME)
    await agentPage.transferChatToSkill('Automated Tests')
  
    // E valida que o atendimento foi transferido com sucesso
    await agentPage.validateToastMessage('Conversa transferida com sucesso')
    await page2.bringToFront()
    await botPage.validateBotMessage('Você foi transferido para fila de antedimento de outra habilidade. Por favor, aguarde até que um de nossos colaboradores responda.')
    await botPage.closeConversation()
    await botPage.validateBotMessage('Olá, qual seu nome completo para iniciarmos o atendimento?')
  })  
})
