# **Copy Trading**

## **Project Information**
#### This project aims to bring together successful traders and people who want to make money using their trading setups. Also, this project is a good option for successful traders because people will pay a fee to see their shared trade setups. Half of this fee will be paid to the trader and users will be able to donate to the trader for each successful setup. This project is not yet completed and various features will be added in the future.

<br>

## **Installation and Requirements**
### 
1. NodeJS
2. near-cli
3. yarn 

Make sure the above requirements are installed in your local. <br>

We have two main directories of this project that name is "frontend" and 
"contract".<br>
Contract directory has smart contract of this project which using near protocol. <br>
Frontend directory has a simple design built with Reactjs and connected to the smart contract of the project.

### **Installing Packages**

`cd contract` <br>
`yarn` <br>
`yarn build` <br>
`yarn deploy` <br>

After running these commands, make sure that: <br> There is an account id like this **dev-1650381404983-51802798802147** in the neardev folder in the contract directory **and copy this code**

So you should be in this folder now `Copy-trading/contract` then <br>
`cd ..` <br>
`cd frontend` <br>
`yarn` <br>
`yarn start` <br>

After completing these steps, paste the copied code into the following field in the src/config.js file

`const CONTRACT_NAME = process.env.CONTRACT_NAME || 'paste here';`

#### **Project installation is complete, your project should be running in your local.**

