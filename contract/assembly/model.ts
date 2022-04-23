// contract/assembly/model.ts
import { context ,PersistentUnorderedMap, math, u128, logging, ContractPromiseBatch } from "near-sdk-as";

export const setups = new PersistentUnorderedMap<u32, TradeSetup>("s");
export const traders = new PersistentUnorderedMap<string,Trader>("t");

@nearBindgen
class Status {
  isOpen:bool //Position Open or Close - true, if is open / false, if closed
  success:bool //If position closed then if position was success true else false
}

@nearBindgen
export class EditableSetup {
  chart: string
  entryPrice:string
  stopLossPrice:string
  takeProfitPrice:string
  riskRewardRatio:string
}

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

