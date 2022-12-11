const base = require('@playwright/test')
import { LoginPage } from '../page/login.page'
import { MenuPage } from '../page/menu.page'
import { AgentAreaPage } from '../page/agentArea.page'
import { ManagerAreaPage } from '../page/managerArea.page'
import { SkillsPage } from '../page/skills.page'
import { ExceptionPage } from '../page/exception.page'
import { TabsPage } from '../page/tabs.page'
import { TicketPage } from '../page/ticket.page'
import vsts from './vstsApi'

const test = base.test.extend({
  loginAgent: async({ page }, use) => {
    const loginPage = new LoginPage(page)
    await page.goto('/')
    await loginPage.doLoginAdmin(process.env.USER_AGENT)
    await use(loginPage)
  },
  loginAdmin: async({ page }, use) => {
    const loginPage = new LoginPage(page)
    await page.goto('/')
    await loginPage.doLoginAdmin(process.env.USER_ADMIN)
    await use(loginPage)
  },
  menuPage: async ({ page }, use) => {
    await use(new MenuPage(page))
  },
  agentPage: async ({ page }, use) => {
    await use(new AgentAreaPage(page))
  },
  managerPage: async ({ page }, use) => {
    await use(new ManagerAreaPage(page))
  },
  skillsPage: async ({ page }, use) => {
    await use(new SkillsPage(page))
  },
  exceptionPage: async ({ page }, use) => {
    await use(new ExceptionPage(page))
  },
  tabsPage: async ({ page }, use) => {
    await use(new TabsPage(page))
  },
  ticketPage: async ({ page }, use) => {
    await use(new TicketPage(page))
  }
})

test.beforeAll(async () => {
  process.env.AZURE = true
  process.env.RUN_ID = '11508'
  if (process.env.AZURE) {
    await vsts.getTestPlan()
    await vsts.createAzureRun()
  }
})

test.afterEach(async ({ }, testInfo) => {
  if (process.env.AZURE) await vsts.postTestResult(testInfo)
})

test.afterAll(async ({ }, suite) => {
  if (process.env.AZURE) {
    // await vsts.patchRunResult(suite)
    await vsts.postRunAttachment()
  }
})

exports.test = test
