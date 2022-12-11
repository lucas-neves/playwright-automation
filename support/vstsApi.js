import data from '../env/vsts.json'
import { request } from '@playwright/test'
import { zip, COMPRESSION_LEVEL } from 'zip-a-folder'

async function context() {
  return await request.newContext({
    baseURL: data.baseApiUrl
  })
}

const points = []
const vsts = {
  getTestPlan: async () => {
    const run = await context()
    const result = await run.get(data.routeGetTestPlan.format(data.testPlanId, data.suiteId), {
      headers: {
        accept: 'application/json',
        Authorization: `Basic ${data.userToken}`,
      }
    })
    await result.json()
      .then(resp => {
        for (let i = 0; i < resp.count; i++) {
          const ctId = resp.value[i].workItem.id
          points[i] = {
            'pointId': resp.value[i].pointAssignments[0].id,
            'testId': ctId
          }
        }
      })
      .catch(() => console.log('Erro ao buscar plano de teste na Azure'))
  },

  createAzureRun: async () => {
    const run = await context()
    const result = await run.post(data.routePostRun, {
      headers: {
        accept: 'application/json',
        Authorization: `Basic ${data.userToken}`,
      },
      data: {        
        'name': `Playwright Automated Tests. ID test plan: ${data.testPlanId} | ID test suite: ${data.suiteId}`,
        'plan': {
            'id': data.testPlanId
        },
        'automated': true
      }
    })
    await result.json()
      .then(resp => process.env.RUN_ID = resp.id)
      .catch(() => console.log('Erro ao criar execução na Azure'))
  },

  postTestResult: async scenario => {
    if (process.env.RUN_ID) {
      const id = scenario.title.match(/(?<=\[).+?(?=\])/g)[0]
      for (let i = 0; i < points.length; i++) {
        if (points[i].testId == id) {
          const run = await context()
          const result = await run.post(data.routePostTestResult.format(process.env.RUN_ID), {
            headers: {
              accept: 'application/json',
              Authorization: `Basic ${data.userToken}`,
            },
            data: [{
              'state': 'Completed',
              'outcome': treatTestStatus(scenario.status),
              'testPoint': {
                  'id': points[i].pointId
              },
              'durationInMs': scenario.duration,
              'errorMessage': scenario.error? `${scenario.error.message}` : ''
            }]
          })
          await result.json().catch(() => console.log('Erro ao postar resultado do teste na Azure'))
        }
      }
    }
  },

  patchRunResult: async suite => {
    if (process.env.RUN_ID) {
      const run = await context()
      const result = await run.patch(data.routePatchRunResult.format(process.env.RUN_ID), {
        headers: {
          accept: 'application/json',
          Authorization: `Basic ${data.userToken}`,
        },
        data: {
          'state': 'Completed',
          'comment': '**Automação de testes executada com sucesso.**\n' +
          '| Nome | Descrição\n' +
          '| :--- | :--- \n' +
          `| **Suite** | ${suite.titlePath[1]} | ---\n` +
          `| **Caminho** | ${suite.file} | ---`
        }
      })
      await result.json().catch(() => console.log('Erro ao concluir execução na Azure'))
    }
  },

  postRunAttachment: async () => {
    if (process.env.RUN_ID) {
      const run = await context()
      const report = await reportToBase64()
      const result = await run.post(data.routePostRunAttachment.format(process.env.RUN_ID), {
        headers: {
          accept: 'application/json',
          Authorization: `Basic ${data.userToken}`,
        },
        data: {
          'stream': report,
          'fileName': 'report.zip',
          'comment': 'Test attachment upload',
          'attachmentType': 'GeneralAttachment'
        }
      })
      await result.json().catch(() => console.log('Erro ao anexar relatório na Azure'))
    }
  }
}

async function reportToBase64() {
  var fs = require('fs')
  const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))
  await snooze(5000)
  await zip('playwright-report', 'report.zip', { compression: COMPRESSION_LEVEL.high })
  return fs.readFileSync('report.zip', { encoding: 'base64' })
}

function treatTestStatus(status) {
  if (status === 'timedOut')
    return 'timeout'
  else if (status === 'skipped')
    return 'notexecuted'
  else if (status === 'interrupted')
    return 'aborted'
  else if (status === undefined)
    return 'unspecified'
  else return status
}

if (!String.prototype.format) {
  String.prototype.format = function() {
      const args = arguments
      return this.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number] != 'undefined'
              ? args[number]
              : match
      })
  }
}

export default vsts
