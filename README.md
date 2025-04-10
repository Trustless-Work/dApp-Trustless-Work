<p align="center"> <img src="https://github.com/user-attachments/assets/5b182044-dceb-41f5-acf0-da22dea7c98a" alt="CLR-S (2)"> </p>

# Trustless Work | [API Documentation](https://docs.trustlesswork.com/trustless-work)

POC of a decentralized application (dApp) to enhance trust in agency-client relationships using blockchain. It enables trustless payments via smart contracts, securing funds in escrow until milestones are approved by clients. Stablecoins like USDC are used to ensure stability and ease of use.

---

![image](https://github.com/user-attachments/assets/d0002030-97a6-4217-84c9-09ae850d985a)

---

# Maintainers | [Telegram](https://t.me/+kmr8tGegxLU0NTA5)

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6b97e15f-9954-47d0-81b5-49f83bed5e4b" alt="Owner 1" width="150" />
      <br /><br />
      <strong>Tech Rebel | Product Manager</strong>
      <br /><br />
      <a href="https://github.com/techrebelgit" target="_blank">techrebelgit</a>
      <br />
      <a href="https://t.me/Tech_Rebel" target="_blank">Telegram</a>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e245e8af-6f6f-4a0a-a37f-df132e9b4986" alt="Owner 2" width="150" />
      <br /><br />
      <strong>Joel Vargas | Frontend Developer</strong>
      <br /><br />
      <a href="https://github.com/JoelVR17" target="_blank">JoelVR17</a>
      <br />
      <a href="https://t.me/joelvr20" target="_blank">Telegram</a>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/53d65ea1-007e-40aa-b9b5-e7a10d7bea84" alt="Owner 3" width="150" />
      <br /><br />
      <strong>Armando Murillo | Full Stack Developer</strong>
      <br /><br />
      <a href="https://github.com/armandocodecr" target="_blank">armandocodecr</a>
      <br />
      <a href="https://t.me/armandocode" target="_blank">Telegram</a>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/851273f6-2f91-413d-bd2d-d8dc1f3c2d28" alt="Owner 4" width="150" />
      <br /><br />
      <strong>Caleb Loría | Smart Contract Developer</strong>
      <br /><br />
      <a href="https://github.com/zkCaleb-dev" target="_blank">zkCaleb-dev</a>
      <br />
      <a href="https://t.me/zkCaleb_dev" target="_blank">Telegram</a>
    </td>
  </tr>
</table>

---

## Getting Started

Follow the steps below to get started with this project:

## Summary

1. Install dependencies.
2. Format code.
3. Set enviroment variables.
4. API KEY
5. Firebase
6. Firebase collections.
7. Run the project!

## Installation

1. Install dependencies:

   ```bash
   npm i
   ```

2. Format the code using Prettier: (This is for avoid eslint errors)

   ```bash
   npx prettier --write .
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

Make sure to set up the following environment variable in your `.env` file:

```

# Branch Develop -> v.2 API
NEXT_PUBLIC_API_URL=https://dev.api.trustlesswork.com

# See API Key Video
NEXT_PUBLIC_API_KEY=

# See Firebase Video
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# MOONPAY -> If you won't use Moonpay, skip these env
NEXT_PUBLIC_MOONPAY_API_KEY=
MOONPAY_SECRET_KEY=

# MAINTANANCE MODE
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_COUNTDOWN_HOURS=2
NEXT_PUBLIC_COUNTDOWN_MINUTES=30

```

### API Key Video

[dApp Trustless Work](https://dapp.trustlesswork.com)

https://github.com/user-attachments/assets/33ea60b7-69b3-456a-afa6-56a7e70eb984

### Firebase Video

[Firebase](https://firebase.google.com)

https://github.com/user-attachments/assets/96d35cee-5e57-41cd-afe5-0389f13c7c94

## Firebase Steps

When you already have the Database, please create a collection called `trustlines` and insert the data below:

```
name
"USDC"
(string)


trustline
"GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
(string)


trustlineDecimals
10000000
(number)
```

and

```
name
"EURC"
(string)


trustline
"GB3Q6QDZYTHWT7E5PVS3W7FUT5GVAFC5KSZFFLPU25GO7VTC3NM2ZTVO"
(string)


trustlineDecimals
10000000
(number)
```

## Wallet Requirements

To use this project, you must have one of the following wallets installed:

- **Freighter**
- **Albedo**
- **xBull**
- **LOBSTR**

These wallets are required to interact with the platform.

### How to use a Wallet

You should use Chrome, Brave or Firefox browser, please install any of the wallets that were listen before.
Important Note: If you're having problems to use Freighter, make sure that you have the wallet in "test net", and also if even you couldn't be able to use because it shows you "Not Available". Try going to: Security > Manage Connected Wallet > Remove the "localhost". If the problem persist, please contact us. This mistake happens for the wallet, not our product.

## IMPORTANT NOTE:

_It's important to note that we are using Husky. This means that when you run a `git push`, Husky will automatically execute `npm run format and npm run lint`. If either of these commands throws an error, the push will not be successful, and you will see a Husky error. When this happens, make sure to resolve any format and lint errors before trying the push again._

---

## **Thanks to all the contributors who have made this project possible!**

[![Contributors](https://contrib.rocks/image?repo=Trustless-Work/dApp-Trustless-Work)](https://github.com/Trustless-Work/dApp-Trustless-Work/graphs/contributors)
