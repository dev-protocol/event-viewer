import * as fs from 'fs'
import * as path from 'path'

export function getAbi(dir: string): any {
	const abiFilePath = path.join(dir, 'abi.json')
	return JSON.parse(fs.readFileSync(abiFilePath, 'utf8'))
}
