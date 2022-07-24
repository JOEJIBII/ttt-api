const { CronJob } = require('cron')
const _ = require('lodash')
const moment = require('moment');
const model = require('../models/server.model')
const fx = require("../functions/server.function");
const { Double } = require('mongodb');
var working = false

module.exports = async () => {
    new CronJob('* * * * * * ', () => {
        !working && mainProcess()
    }, null, true)
}

const mainProcess = async () => {
    try {
        working = true
        console.log("working", working)
        let tx = (await model.getBankTransaction())[0]
        if (!_.isEmpty(tx)) {
            //let deposit = require('../build/deposit.column')
            let deposit = {
                channel: "auto",
                agent_id: null,
                type: 'deposit',
                sub_type: 'auto deposit',
                bank_transaction_id: null,
                date: null,
                memb_id: null,
                from_bank_id: null,
                from_account_id: null,
                to_bank_id: null,
                to_account_id: null,
                amount: null,
                silp_date: null,
                silp_image: null,
                request_by: 'auto deposit api',
                request_date: null,
                approve_by: null,
                approve_date: null,
                status: null,
                description: null,
                turnover_status: null,
                turnover_date: null,
                turnover_value: null,
                turnover_use: null,
                ref_id: null,
                lock_status: '',
                lock_by: '',
                lock_date: null,
                cr_by: 'auto deposit api',
                cr_date: null,
                cr_prog: null,
                upd_by: null,
                upd_date: null,
                upd_prog: null
            }
            let cof = (await model.getconfig_pd(tx['agent_id']))[0]
            let dBankCode = (tx['d_code']).toUpperCase()
            if (dBankCode === 'SCB') {
                let mBankCode = (tx['m_code']).toUpperCase()
                console.log("-------------------", mBankCode)
                if (mBankCode === 'SCB') {
                    console.log("agent_id", tx['agent_id'], "m_bank", tx['m_bank'], "m_no", tx['m_no'], "m_name", tx['m_name'])
                    let a = await model.SCB2SCB(tx['agent_id'], tx['m_bank'], tx['m_no'], tx['m_name'])
                    if (!_.isEmpty(a)) {
                        console.log("-------------------", a.length)
                        if (a.length === 1) {
                            a = a[0];
                            let sDate = tx['date'].split('/');
                            let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                            deposit['agent_id'] = tx['agent_id']
                            deposit['bank_transaction_id'] = tx['_id']
                            deposit['date'] = datetime
                            deposit['memb_id'] = a['memb_id']
                            deposit['from_bank_id'] = a['from_bank_id']
                            deposit['from_account_id'] = a['from_account_id']
                            deposit['to_bank_id'] = tx['d_bank']
                            deposit['to_account_id'] = tx['d_account']
                            deposit['amount'] = Number(tx['amount'])
                            deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                            deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                            deposit['request_date'] = new Date(moment().format())
                            deposit['approve_by'] = 'auto deposit api'
                            deposit['approve_date'] = new Date(moment().format())
                            deposit['status'] = 'success'
                            deposit['description'] = [{ username: 'System', note: 'ระบบสามารถทำการ matching บัญชีลูกค้าได้', note_date: new Date() }]
                            deposit['cr_date'] = new Date(moment().format())
                            deposit['upd_by'] = 'auto deposit api'
                            deposit['upd_date'] = new Date(moment().format())
                            const date = new Date()
                            const future = 5 * 60 * 1000
                            date.setTime(date.getTime() + future)
                            let find_doc = await model.findlast_deposit(a['memb_id'])
                            if(find_doc.length > 0){
                                let updatelastdoc = await model.update_docdeposit_turnover(find_doc[0]._id,date)
                            }
                            let insert = await model.insertDeposit(deposit)
                            await model.updateTxS(tx['_id'], 'success')
                            let user = (await model.findmember_username(a['memb_id']))[0]
                            let call = await fx.depositPD(cof, user.username, Number(tx['amount']))
                            if (call.result.code === 0) {
                                await model.updaterefid(insert.insertedId, call.result.data.refId)[0]
                            }
                            console.log('Response', call)
                            console.log('main process success (success matching scb2scb) , process will restart now')
                            mainProcess();
                        } else {
                            let sDate = tx['date'].split('/');
                            let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                            deposit['agent_id'] = tx['agent_id']
                            deposit['bank_transaction_id'] = tx['_id']
                            deposit['date'] = datetime
                            deposit['amount'] = Number(tx['amount'])
                            deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                            deposit['to_bank_id'] = tx['d_bank']
                            deposit['to_account_id'] = tx['d_account']
                            deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                            deposit['request_date'] = new Date(moment().format())
                            deposit['status'] = 'pending'
                            deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (duplicate bank account)', note_date: new Date() }]
                            deposit['cr_date'] = new Date(moment().format())
                            await model.insertDeposit(deposit)
                            await model.updateTxS(tx['_id'], 'success')
                            console.log('main process success (duplicate matching), process will restart now')
                            mainProcess();
                        }
                    } else {
                        let sDate = tx['date'].split('/');
                        let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                        deposit['agent_id'] = tx['agent_id']
                        deposit['bank_transaction_id'] = tx['_id']
                        deposit['date'] = datetime
                        deposit['amount'] = Number(tx['amount'])
                        deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                        deposit['to_bank_id'] = tx['d_bank']
                        deposit['to_account_id'] = tx['d_account']
                        deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                        deposit['request_date'] = new Date(moment().format())
                        deposit['status'] = 'pending'
                        deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (not found bank account)', note_date: new Date() }]
                        deposit['cr_date'] = new Date(moment().format())
                        await model.insertDeposit(deposit)
                        await model.updateTxS(tx['_id'], 'success')
                        console.log('main process success (not found matching), process will restart now')
                        mainProcess();
                    }
                } else {
                    let a = await model.SCB2OTH(tx['agent_id'], tx['m_bank'], tx['m_no'])
                    if (!_.isEmpty(a)) {
                        if (a.length === 1) {
                            a = a[0];
                            let sDate = tx['date'].split('/');
                            let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                            deposit['agent_id'] = tx['agent_id']
                            deposit['bank_transaction_id'] = tx['_id']
                            deposit['date'] = datetime
                            deposit['memb_id'] = a['memb_id']
                            deposit['from_bank_id'] = a['from_bank_id']
                            deposit['from_account_id'] = a['from_account_id']
                            deposit['to_bank_id'] = tx['d_bank']
                            deposit['to_account_id'] = tx['d_account']
                            deposit['amount'] = Number(tx['amount'])
                            deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                            deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                            deposit['request_date'] = new Date(moment().format())
                            deposit['approve_by'] = 'auto deposit api'
                            deposit['approve_date'] = new Date(moment().format())
                            deposit['status'] = 'success'
                            deposit['description'] = [{ username: 'System', note: 'ระบบสามารถทำการ matching บัญชีลูกค้าได้', note_date: new Date() }]
                            deposit['cr_date'] = new Date(moment().format())
                            deposit['upd_by'] = 'auto deposit api'
                            deposit['upd_date'] = new Date(moment().format())
                            const date = new Date()
                            const future = 5 * 60 * 1000
                            date.setTime(date.getTime() + future)
                            let find_doc = await model.findlast_deposit(a['memb_id'])
                            if(find_doc.length > 0){
                                let updatelastdoc = await model.update_docdeposit_turnover(find_doc[0]._id,date)
                            }
                            
                            let insert = await model.insertDeposit(deposit)
                            //console.log("insert", insert)
                            await model.updateTxS(tx['_id'], 'success')
                            let user = (await model.findmember_username(a['memb_id']))[0]
                            let call = await fx.depositPD(cof, user.username, Number(tx['amount']))
                            if (call.result.code === 0) {
                                await model.updaterefid(insert.insertedId, call.result.data.refId)[0]
                            }
                            console.log('Response', call)
                            console.log('main process success (success matching), process will restart now')
                            mainProcess();
                        } else {
                            let sDate = tx['date'].split('/');
                            let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                            deposit['agent_id'] = tx['agent_id']
                            deposit['bank_transaction_id'] = tx['_id']
                            deposit['date'] = datetime
                            deposit['to_bank_id'] = tx['d_bank']
                            deposit['to_account_id'] = tx['d_account']
                            deposit['amount'] = Number(tx['amount'])
                            deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                            deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                            deposit['request_date'] = new Date(moment().format())
                            deposit['status'] = 'pending'
                            deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (duplicate bank account)', note_date: new Date(moment().format()) }]
                            deposit['cr_date'] = new Date(moment().format())
                            await model.insertDeposit(deposit)
                            await model.updateTxS(tx['_id'], 'success')
                            console.log('main process success (duplicate matching), process will restart now')
                            mainProcess();
                        }
                    } else {
                        let sDate = tx['date'].split('/');
                        let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                        deposit['agent_id'] = tx['agent_id']
                        deposit['bank_transaction_id'] = tx['_id']
                        deposit['date'] = datetime
                        deposit['to_bank_id'] = tx['d_bank']
                        deposit['to_account_id'] = tx['d_account']
                        deposit['amount'] = Number(tx['amount'])
                        deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                        deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                        deposit['request_date'] = new Date(moment().format())
                        deposit['status'] = 'pending'
                        deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (not found bank account)', note_date: new Date(moment().format()) }]
                        deposit['cr_date'] = new Date(moment().format())
                        await model.insertDeposit(deposit)
                        await model.updateTxS(tx['_id'], 'success')
                        console.log('main process success (not found matching), process will restart now')
                        mainProcess();
                    }
                }
            } else if (dBankCode === 'KBANK') {
                let mBankCode = (tx['m_code']).toUpperCase()
                let findaccount_agent = (await model.findaccount_agent(tx['agent_id'], tx['d_bank'], tx['d_oth_account']))[0]
                console.log('findaccount_agent', findaccount_agent)
                if (mBankCode === 'KBANK') {
                    let a = await model.KBANK2KBANK(tx['agent_id'], tx['m_bank'], tx['m_no']) //findaccount_agent
                    if (!_.isEmpty(a)) {
                        console.log("-------------------", a.length)
                        if (a.length === 1) {
                            a = a[0];
                            let sDate = tx['date'].split('/');
                            let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                            deposit['agent_id'] = tx['agent_id']
                            deposit['bank_transaction_id'] = tx['_id']
                            deposit['date'] = datetime
                            deposit['memb_id'] = a['memb_id']
                            deposit['from_bank_id'] = a['from_bank_id']
                            deposit['from_account_id'] = a['from_account_id']
                            deposit['to_bank_id'] = findaccount_agent.to_bank_id
                            deposit['to_account_id'] = findaccount_agent.to_account_id
                            deposit['amount'] = Number(tx['amount'])
                            deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                            deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                            deposit['request_date'] = new Date(moment().format())
                            deposit['approve_by'] = 'auto deposit api'
                            deposit['approve_date'] = new Date(moment().format())
                            deposit['status'] = 'success'
                            deposit['description'] = [{ username: 'System', note: 'ระบบสามารถทำการ matching บัญชีลูกค้าได้', note_date: new Date() }]
                            deposit['cr_date'] = new Date(moment().format())
                            deposit['upd_by'] = 'auto deposit api'
                            deposit['upd_date'] = new Date(moment().format())
                            const date = new Date()
                            const future = 5 * 60 * 1000
                            date.setTime(date.getTime() + future)
                            let find_doc = await model.findlast_deposit(a['memb_id'])
                            if(find_doc.length > 0){
                                let updatelastdoc = await model.update_docdeposit_turnover(find_doc[0]._id,date)
                            }
                            
                            let insert = await model.insertDeposit(deposit)
                            await model.updateTxS(tx['_id'], 'success')
                            let user = (await model.findmember_username(a['memb_id']))[0]
                            let call = await fx.depositPD(cof, user.username, Number(tx['amount']))
                            if (call.result.code === 0) {
                                await model.updaterefid(insert.insertedId, call.result.data.refId)[0]
                            }
                            console.log('Response', call)
                            console.log('main process success (success matching), process will restart now')
                            mainProcess();
                        } else {
                            let sDate = tx['date'].split('/');
                            let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                            deposit['agent_id'] = tx['agent_id']
                            deposit['bank_transaction_id'] = tx['_id']
                            deposit['date'] = datetime
                            deposit['amount'] = Number(tx['amount'])
                            deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                            deposit['to_bank_id'] = findaccount_agent.to_bank_id
                            deposit['to_account_id'] = findaccount_agent.to_account_id
                            deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                            deposit['request_date'] = new Date(moment().format())
                            deposit['status'] = 'pending'
                            deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (duplicate bank account)', note_date: new Date() }]
                            deposit['cr_date'] = new Date(moment().format())
                            await model.insertDeposit(deposit)
                            await model.updateTxS(tx['_id'], 'success')
                            console.log('main process success (duplicate matching), process will restart now')
                            mainProcess();
                        }
                    } else {
                        let sDate = tx['date'].split('/');
                        let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                        deposit['agent_id'] = tx['agent_id']
                        deposit['bank_transaction_id'] = tx['_id']
                        deposit['date'] = datetime
                        deposit['amount'] = Number(tx['amount'])
                        deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                        deposit['to_bank_id'] = findaccount_agent.to_bank_id
                        deposit['to_account_id'] = findaccount_agent.to_account_id
                        deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                        deposit['request_date'] = new Date(moment().format())
                        deposit['status'] = 'pending'
                        deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (not found bank account)', note_date: new Date() }]
                        deposit['cr_date'] = new Date(moment().format())
                        await model.insertDeposit(deposit)
                        await model.updateTxS(tx['_id'], 'success')
                        console.log('main process success (not found matching), process will restart now')
                        mainProcess();
                    }
                } else {
                    let sDate = tx['date'].split('/');
                    let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                    deposit['agent_id'] = tx['agent_id']
                    deposit['bank_transaction_id'] = tx['_id']
                    deposit['date'] = datetime
                    deposit['amount'] = Number(tx['amount'])
                    deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                    deposit['to_bank_id'] = findaccount_agent.to_bank_id
                    deposit['to_account_id'] = findaccount_agent.to_account_id
                    deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                    deposit['request_date'] = new Date(moment().format())
                    deposit['status'] = 'pending'
                    deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (not found bank account)', note_date: new Date() }]
                    deposit['cr_date'] = new Date(moment().format())
                    await model.insertDeposit(deposit)
                    await model.updateTxS(tx['_id'], 'success')
                    console.log('main process success (not found matching), process will restart now')
                    mainProcess();
                }

            } else if (dBankCode === 'KTB') {

            } else {
                let sDate = tx['date'].split('/');
                let datetime = new Date(`${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`)
                deposit['agent_id'] = tx['agent_id']
                deposit['bank_transaction_id'] = tx['_id']
                deposit['date'] = datetime
                deposit['amount'] = Number(tx['amount'])
                deposit['turnover_value'] = Double(tx['amount']) * Double(cof.turnover_config.cash_multiplier)
                deposit['silp_date'] = `${sDate[2]}-${sDate[1]}-${sDate[0]} ${tx['time']}:00+0700`
                deposit['request_date'] = new Date(moment().format())
                deposit['status'] = 'pending'
                deposit['description'] = [{ username: 'System', note: 'ระบบไม่สามารถทำการ matching บัญชีลูกค้าได้ (notification data)', note_date: new Date(moment().format()) }]
                deposit['cr_date'] = new Date(moment().format())
                await model.insertDeposit(deposit)
                await model.updateTxS(tx['_id'], 'success')
                console.log('main process success (notification), process will restart now')
                mainProcess();
            }
        } else {
            console.log('main process success (not data), process will restart in 5 sec.')
            setTimeout(() => working = false, 5000)
        }
    } catch (error) {
        console.error('main process error, process will restart in 10 sec.', error)
        setTimeout(() => working = false, 10000)
    }
}