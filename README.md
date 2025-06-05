@ Thirdweb Support

Relevant files:

ConnectEcho.tsx   -> ConnectButton with Account Abstraction settings

For testing I tried to create a profile on the /profile page, with the createProfile function used in ProfileHeader.tsx. This works without account abstraction, but with the account abstraction settings I got this error:


Error: Unknown paymaster version
    at getEntryPointVersion (constants.js:70:11)
    at createUnsignedUserOp (userop.js:132:98)
    at _sendUserOp (index.js:442:107)
    at Object.sendTransaction (index.js:209:34)
    at sendTransaction (send-transaction.js:191:34)
    at async sendTx (useSendTransaction.js:70:37)



