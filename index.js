const { writeFileSync } = require('fs')
const fetch = require('node-fetch')
const { config } = require('dotenv')

config()

const REQ_URL = `https://blockscout.com/xdai/mainnet/api?module=account&action=tokentx&address=${process.env.ADDRESS}&sort=asc`

const main = (async () => {
  const rawRes = await fetch(REQ_URL)
  const res = await rawRes.json()
  const { result } = res

  const data = result
    .map(tx => ({
      value: (+tx.value / 1e18).toFixed(3),
      from: tx.from,
      to: tx.to,
      contractAddress: tx.contractAddress,
      tokenSymbol: tx.tokenSymbol,
      hash: tx.hash,
      blockNumber: tx.blockNumber
    }))
    .filter(tx => process.env.TOKEN ? tx.contractAddress === process.env.TOKEN : true )

    .map(tx => `${tx.value}, ${tx.from}, ${tx.to}, ${tx.contractAddress}, ${tx.tokenSymbol}, ${tx.hash}, ${tx.blockNumber}`)

  console.log(`${data.length} transactions found.`)
  writeFileSync('./transactions.csv', 'value, from, to, contract address, token symbol, hash, block number\n')
  writeFileSync('./transactions.csv', data.join('\n'), { flag: 'a' })
})()
