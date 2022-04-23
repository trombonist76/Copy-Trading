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
<br>


## **Copy-Trade Smart Contract**

### **1. Assembly Directory**
#### In this folder, there are smart contract codes developed by the project using assemblyscript and the near-sdk package provided by Near protocol.
<br>

### **2. model.ts**
#### In this file, there are various model classes of the Copy-Trade project such as 'Trader', 'Trade Setup'. These codes, which constitute the main idea of ​​the project, are then presented to the users with the frontend with which the users will interact.

`export const setups = new PersistentUnorderedMap<u32, TradeSetup>("s")` <br>
`export const traders = new PersistentUnorderedMap<string,Trader>("t")` <br>

#### The above code is the objects we keep as key(id): value(setups/traders) in the trade setups and traders.
<br>
<br>

### **Trader Class**
#### Below are the class we created for the Trader object and the functions that give it functionality. The id value of the trader object is the same as the user's wallet account id.The name value is the user's own nickname and the winrate is the winning rate of the trade setups created by the trader. This property will then be obtained from the exchange used by the trader. Currently, the user adds this feature himself. 
<br>

```
@nearBindgen
export class Trader {
  id:string //context.sender (wallet.accountId)
  name:string //nickname
  winrate: u32; 
  constructor(name:string,winrate:u32) {
    this.id = context.sender
    this.name = name
    this.winrate = winrate
}
  static insert(name:string, winrate:u32): Trader {
    assert(winrate >= 50, "Winrate must be over %50")
    const trader = new Trader(name,winrate)
    assert(!this.doesContainsAccId(trader.id),"The trader must be create one times")
    traders.set(trader.id,trader)

    return trader
  }

  static getByAccId(accId:string):Trader{
    assert(this.doesContainsAccId(accId),"User not a trader.")
    const trader = traders.getSome(accId)

    return trader
  }

  static deleteByAccId(accId:string):void{
    assert(this.doesContainsAccId(accId),"User not a trader.")
    traders.delete(accId)

  }

  static doesContainsAccId(accId:string):bool{
    const isTrader = traders.contains(accId)
    return isTrader
  }
}
```

#### **A. insert function**
#### This function adds the created trader object to ``<PersistentUnorderedMap>`` 

<br>

#### **B. getByAccId function**
#### This function returns the trader object that matches the given id.
<br>

#### **C. deleteByAccId function**
#### This function deletes the trader object that matches the given id.
<br>

#### **D. doesContainsAccId function**
#### This function is based on the id entered in ``<PersistentUnorderedMap>`` checks if the trader object exists

<br>
<br>

### **TradeSetup Class**
<br>
It contains various properties of the TradeSetup class below. These are the properties that should be in a trade setup".
Some features here include information about the status of the setup and the subscription for users to see the setup.
<br>

```
@nearBindgen
export class TradeSetup {
  id: u32;
  trader:Trader
  pair:string      
  chart: string;   
  side: string;     
  riskRewardRatio:string
  entryPrice:string
  stopLossPrice:string
  takeProfitPrice:string
  owner:string
  subs: Array<string>
  status: Status 
  
  constructor(trader:Trader, pair:string, chart:string, side: string, entryPrice:string, stopLossPrice:string, takeProfitPrice:string, riskRewardRatio:string) {
    this.id = math.hash32<string>(chart);
    this.trader = trader
    this.pair = pair
    this.chart = chart
    this.side = side
    this.entryPrice = entryPrice
    this.stopLossPrice = stopLossPrice 
    this.takeProfitPrice = takeProfitPrice
    this.riskRewardRatio = riskRewardRatio
    this.owner = context.sender
    this.subs = new Array<string>()
    this.status = new Status()
    this.status.isOpen = true
  }

  static findByIdAndUpdate(id: u32, partial: EditableSetup): TradeSetup {
    const tradeSetup = this.findById(id)
    this.assertIsNotOwner(context.predecessor,tradeSetup.owner)
    tradeSetup.chart = partial.chart;
    tradeSetup.entryPrice = partial.entryPrice;
    tradeSetup.stopLossPrice = partial.stopLossPrice;
    tradeSetup.takeProfitPrice = partial.takeProfitPrice;
    tradeSetup.riskRewardRatio = partial.riskRewardRatio;
    tradeSetup.owner = context.sender
    // near call dev-1650581430626-47084412131160 updateSetup '{\"id\":1847218053,\"updates\":{\"chart\":\"a\",\"entryPrice":"5","stopLossPrice":"7","takeProfitPrice":"1","riskRewardRatio":"2.5"}}
    setups.set(id, tradeSetup);

    return tradeSetup;
  }

  static insertSub(id:u32): TradeSetup {

    this.assertInsufficentDeposit(context.attachedDeposit)
    const setup = TradeSetup.findById(id)
    this.assertSubscriberIsExist(setup,context.sender)
    setup.subs.push(context.sender)
    setups.set(id,setup)
    const amount = u128.div(context.attachedDeposit,u128.fromI32(2))
    ContractPromiseBatch.create(setup.owner).transfer(amount)
    return setup
  }

  static updateStatus(id:u32, success:bool):TradeSetup{
    const setup = TradeSetup.findById(id)
    setup.status.isOpen = false
    setup.status.success = success
    setups.set(id,setup)
    return setup
  }

  static donate(id:u32): Trader {
    const tradeSetup = this.findById(id)
    ContractPromiseBatch.create(tradeSetup.owner).transfer(context.attachedDeposit)
    const trader = Trader.getByAccId(tradeSetup.owner)
    return trader
  }

  static insert(trader:Trader, pair:string, chart:string, side: string, entryPrice:string, stopLossPrice:string, takeProfitPrice:string, riskRewardRatio:string): TradeSetup {
    const tradeSetup = new TradeSetup(trader, pair, chart, side, entryPrice, stopLossPrice, takeProfitPrice, riskRewardRatio)
    setups.set(tradeSetup.id, tradeSetup)

    return tradeSetup
  }

  static findById(id: u32): TradeSetup {
    return setups.getSome(id)
  }

  static find(offset: u32, limit: u32): TradeSetup[] {
    return setups.values(offset, offset + limit)
  }

  static findByIdAndDelete(id: u32): void {
    logging.log(context.sender)
    setups.delete(id);
  }

  static doesContainsId(id: u32): bool {
    const isAdded = setups.contains(id);
    return isAdded
  }

  static assertIsExist(id: u32): void {
    assert(!this.doesContainsId(id),"The setup must be create one times")
  }

  static assertInsufficentDeposit(attachedDeposit: u128): void {
    assert(attachedDeposit >= u128.from("1000000000000000000000000"),"Insufficient amount. Near amount must be 1 Near at least")
  }

  static assertIsNotOwner(contextSender:string,setupSender: string): void {
    assert(contextSender == setupSender,"Access denied. Setup can be edit by owner" )
  }

  static assertSubscriberIsExist(setup:TradeSetup,owner:string): void {
    assert(!setup.subs.includes(owner),"User already subscribe the setup" )
  }

}
```
#### Here, unlike the functions found in the trader object, the following functions are included.
<br>

 #### **A. findByIdAndUpdate**
 #### This function takes the properties in the EditableTradeSetup class as parameters and updates the setup with the specified id. Only the trader who created it can update this setup.
<br>

 #### **B. find**
 #### This function returns a varying number of trade setups based on the specified limit and offset parameters. Considering that we have hundreds of setups and it will take time to load them all at once, this function will be very useful for us. This function can also be used for pagination.
<br>

 #### **C. insertSub**
 #### In this smart contract basis, users have to pay a certain amount of fee to see the setups created by the traders. Therefore, a subscription system is created here, allowing users who pay fees to see the setups. This function adds users to subscriber array.

 <br>

 #### **D. updateStaus**
 #### This function is used to close an open position (setup) and change its status.

 <br>


 #### **E. donate**
 #### If the setup status is successful, users who are members of that setup can reward the trader with this function.

 <br>

 ## **3. index.ts**
### It allows us to make blockchain calls on near with the function names specified in the various file, by arranging it so that the users we write in the model.ts file can use here. In this project, users can use these codes by interacting with the frontend.

<br>

```

export function createSetup(traderAccId:string, pair:string, chart:string, side: string, entryPrice:string, stopLossPrice:string, takeProfitPrice:string, riskRewardRatio:string): TradeSetup {
  const trader = Trader.getByAccId(traderAccId)
  return TradeSetup.insert(trader, pair, chart, side, entryPrice, stopLossPrice, takeProfitPrice, riskRewardRatio);
}

export function getSetups(offset: u32, limit: u32 = 10): TradeSetup[] { 
  return TradeSetup.find(offset,limit);
}

export function donateTraderBySetupId(id: u32): Trader { 
  return TradeSetup.donate(id);
}

export function getSetupById(id: u32): TradeSetup { 
  return TradeSetup.findById(id);
}

export function updateSetup(id: u32, updates: EditableSetup): TradeSetup { 
  return TradeSetup.findByIdAndUpdate(id, updates);
}

export function deleteSetup(id: u32): void { 
  TradeSetup.findByIdAndDelete(id);
}

export function addSubToSetup(id: u32): TradeSetup { 
  return TradeSetup.insertSub(id);
}

export function updateSetupStatus(id: u32,success:bool): TradeSetup { 
  return TradeSetup.updateStatus(id,success);
}

export function createTrader(name:string,winrate:u32): Trader {
  return Trader.insert(name,winrate);
}

export function isTrader(id: string): bool { 
  return Trader.doesContainsAccId(id);
}

```
