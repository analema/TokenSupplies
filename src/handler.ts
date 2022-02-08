import { BigNumber, ethers } from 'ethers';

import BEP20_ABI from './bep20_abi.json';
import { JsonFragment } from '@ethersproject/abi';
import { RPCApi } from './RpcApi';

export class Handler {
    bepAbi: ReadonlyArray<JsonFragment> = BEP20_ABI;
    rpcApi: RPCApi | undefined;

    constructor (
        private endpoint: string,
        private address: string,
        private balances: { [key: string]: string },
        private _totalSupply: string,
        private tokenDecimals: number,
    ) {
        this.rpcApi = new RPCApi({
            endpoint: this.endpoint,
            address: this.address,
            abi: this.bepAbi,
        });
    }

    private get api(): RPCApi {
        return this.rpcApi as RPCApi;
    }

    private async getBalance(address: string): Promise<number> {
        return await this.api.balanceOf(address);
    }

    private async circulatingSupply(): Promise<string> {
        const addresses = Object.keys(this.balances).map(key => this.balances[key]);

        let totalLocked = BigNumber.from(this._totalSupply)

        for (let index = 0; index < addresses.length; index++) {
            const balance = await this.getBalance(addresses[index]);

            totalLocked = totalLocked.sub(BigNumber.from((balance).toString()));
        }

        return ethers.utils.formatUnits(totalLocked, this.tokenDecimals);
    }

    private async totalSupply(): Promise<string> {
        let totalLocked = BigNumber.from(this._totalSupply)

        const deadAmount = await this.getBalance(this.balances.dead);

        totalLocked = totalLocked.sub(BigNumber.from((deadAmount).toString()));

        return ethers.utils.formatUnits(totalLocked, this.tokenDecimals);
    }

    async handleRequest(type: 'circulating' | 'total'): Promise<Response> {
        if (type === 'circulating') {
            return new Response(await this.circulatingSupply())
        }

        return new Response(await this.totalSupply());
    }
}
