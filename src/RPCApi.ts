import { JsonFragment } from '@ethersproject/abi';
import { ethers } from 'ethers'

export class RPCApi {
    id = 0;
    endpoint: string;
    address: string | undefined;
    abi: ReadonlyArray<JsonFragment> | undefined;
    interface: ethers.utils.Interface | undefined;

    constructor({ endpoint, address, abi }: { endpoint: string, address: string, abi: ReadonlyArray<JsonFragment> }) {
        this.endpoint = endpoint;
        this.setContract({ address, abi });
    }

    private get nextId(): number {
        return ++this.id;
    }

    public setContract(
        { address, abi }: { address: string, abi: ReadonlyArray<JsonFragment> }
    ): ethers.utils.Interface {
        this.address = address;
        this.abi = abi;
        this.interface = new ethers.utils.Interface(abi);

        return this.interface;
    }

    public async balanceOf (address: string): Promise<number> {
        const balance = await this.call('balanceOf', [ address ]);
        return parseInt(balance);
    }

    private async call (fn: string, params: unknown[]) {
        return this.fetch('eth_call', [
            {
                to: this.address ?? '',
                data: this.interface?.encodeFunctionData(fn, params)
            },
            'latest'
        ]);
    }

    private async fetch(method: string, params: unknown[] = []) {
        const res = await fetch(
            this.endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: 2.0,
                method,
                params,
                id: this.nextId,
            })
        });

        const { result, error } = await res.json()

        if (error) {
            throw new Error(`RPC error: ${error}`)
        }

        return result
    }
}
