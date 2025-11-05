import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction, Inputs, coinWithBalance } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { generateSHA256Hash } from './generate-hash-with-lib';
import BN = require('bn.js');


const USDCType = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
const NAVXType = "0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX";
const PoolAddress = "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30";

const getKeypairAndWallet = () => {
    const mnemonics: string = process.env.MNEMONICS!;
    const i = 0;
    const path = `m/44'/784'/${i}'/0'/0'`;
    const keypair = Ed25519Keypair.deriveKeypair(mnemonics, path);
    const wallet = keypair.toSuiAddress();
    return { keypair, wallet };
};

export const swapAllNavx = async () => {
    const { keypair, wallet } = getKeypairAndWallet();

    const suiClient = new SuiClient({
        url: process.env.RPC!,
    });

    const balanceInfo = await suiClient.getBalance({ owner: wallet, coinType: USDCType });
    const balanceAmount = new BN(balanceInfo.totalBalance);
    console.log(`balanceAmount: ${balanceAmount.toString()}`);
    const amountOutLimit = balanceAmount.mul(new BN(999)).div(new BN(1000));
    console.log(`amountOutLimit (99.9%): ${amountOutLimit.toString()}`);

    const tx = new Transaction()
    const orderId = generateSHA256Hash()
    const [swapContext] = tx.moveCall({
        package: "0xde5d696a79714ca5cb910b9aed99d41f67353abb00715ceaeb0663d57ee39640",
        module: "router",
        function: "new_swap_context",
        arguments: [
            tx.pure(bcs.String.serialize(orderId)),
            tx.pure(bcs.U64.serialize(amountOutLimit.toString())),
            tx.pure(bcs.U64.serialize(amountOutLimit.toString())),
            coinWithBalance({ type: USDCType, balance: BigInt(balanceAmount.toString()) }),
            tx.pure(bcs.U32.serialize(10)),
            tx.pure(bcs.Address.serialize('0x434b1b93eb775c2d30b38a12ddaee7294d157142b9dfbe37319cd35050c6eb92')),
        ],
        typeArguments: [
            USDCType,
            USDCType,
        ],
    });

    tx.moveCall({
        package: "0x1ea2ff1d9d477a71bd4de2d3885a10b597f0842d1026e176c58937499b0e3fda",
        module: "magma",
        function: "swap_a2b",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x4c4e1402401f72c7d8533d0ed8d5f8949da363c7a3319ccef261ffe153d32f8a", 
                initialSharedVersion: "481056560", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30", 
                initialSharedVersion: "565093259", 
                mutable: true 
            })),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            NAVXType,
        ],
    });
    tx.moveCall({
        package: "0x1ea2ff1d9d477a71bd4de2d3885a10b597f0842d1026e176c58937499b0e3fda",
        module: "magma",
        function: "swap_b2a",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x4c4e1402401f72c7d8533d0ed8d5f8949da363c7a3319ccef261ffe153d32f8a", 
                initialSharedVersion: "481056560", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30", 
                initialSharedVersion: "565093259", 
                mutable: true 
            })),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x6", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            NAVXType,
        ],
    });

    tx.moveCall({
        package: "0x1ea2ff1d9d477a71bd4de2d3885a10b597f0842d1026e176c58937499b0e3fda",
        module: "magma",
        function: "swap_a2b",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x4c4e1402401f72c7d8533d0ed8d5f8949da363c7a3319ccef261ffe153d32f8a", 
                initialSharedVersion: "481056560", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30", 
                initialSharedVersion: "565093259", 
                mutable: true 
            })),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            NAVXType,
        ],
    });
    tx.moveCall({
        package: "0x1ea2ff1d9d477a71bd4de2d3885a10b597f0842d1026e176c58937499b0e3fda",
        module: "magma",
        function: "swap_b2a",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x4c4e1402401f72c7d8533d0ed8d5f8949da363c7a3319ccef261ffe153d32f8a", 
                initialSharedVersion: "481056560", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30", 
                initialSharedVersion: "565093259", 
                mutable: true 
            })),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x6", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            NAVXType,
        ],
    });

    tx.moveCall({
        package: "0x1ea2ff1d9d477a71bd4de2d3885a10b597f0842d1026e176c58937499b0e3fda",
        module: "magma",
        function: "swap_a2b",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x4c4e1402401f72c7d8533d0ed8d5f8949da363c7a3319ccef261ffe153d32f8a", 
                initialSharedVersion: "481056560", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30", 
                initialSharedVersion: "565093259", 
                mutable: true 
            })),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x0000000000000000000000000000000000000000000000000000000000000006", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            NAVXType,
        ],
    });
    tx.moveCall({
        package: "0x1ea2ff1d9d477a71bd4de2d3885a10b597f0842d1026e176c58937499b0e3fda",
        module: "magma",
        function: "swap_b2a",
        arguments: [
            swapContext!,
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x4c4e1402401f72c7d8533d0ed8d5f8949da363c7a3319ccef261ffe153d32f8a", 
                initialSharedVersion: "481056560", 
                mutable: false 
            })),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0xa25272368c0f3310cef8111dc948fc54bced1e99549170980c416dace9149e30", 
                initialSharedVersion: "565093259", 
                mutable: true 
            })),
            tx.pure(bcs.U64.serialize("18446744073709551615")),
            tx.object(Inputs.SharedObjectRef({ 
                objectId: "0x6", 
                initialSharedVersion: "1", 
                mutable: false 
            })),
        ],
        typeArguments: [
            USDCType,
            NAVXType,
        ],
    });

    const [coin] = tx.moveCall({
        package: "0xde5d696a79714ca5cb910b9aed99d41f67353abb00715ceaeb0663d57ee39640",
        module: "router",
        function: "confirm_swap",
        arguments: [
            swapContext!,
        ],
        typeArguments: [
            USDCType,
        ],
    });

    tx.transferObjects([coin!], wallet);
    tx.setGasBudget(2_000_000_000);
    tx.setSender(wallet);

    // const dataSentToFullnode = await tx.build({ client: suiClient });
    // const dryrun_result = await suiClient.dryRunTransactionBlock({
    //     transactionBlock: dataSentToFullnode,
    // });
    // console.log(dryrun_result);
    const result = await suiClient.signAndExecuteTransaction({ transaction: tx, signer: keypair });
    console.log("result", result);
}