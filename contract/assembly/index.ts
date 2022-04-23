import { TradeSetup, EditableSetup, Trader} from "./model";

export function createSetup(traderAccId:string, pair:string, chart:string, side: string, entryPrice:string, stopLossPrice:string, takeProfitPrice:string, riskRewardRatio:string): TradeSetup { /**/
  const trader = Trader.getByAccId(traderAccId)
  return TradeSetup.insert(trader, pair, chart, side, entryPrice, stopLossPrice, takeProfitPrice, riskRewardRatio);
}

export function getSetups(offset: u32, limit: u32 = 10): TradeSetup[] { /* */
  return TradeSetup.find(offset,limit);
}

export function donateTraderBySetupId(id: u32): Trader { /* */
  return TradeSetup.donate(id);
}

export function getSetupById(id: u32): TradeSetup { /* */
  return TradeSetup.findById(id);
}

export function updateSetup(id: u32, updates: EditableSetup): TradeSetup { /* */
  return TradeSetup.findByIdAndUpdate(id, updates);
}

export function deleteSetup(id: u32): void { /* */
  TradeSetup.findByIdAndDelete(id);
}

export function addSubToSetup(id: u32): TradeSetup { /* */
  return TradeSetup.insertSub(id);
}

export function updateSetupStatus(id: u32,success:bool): TradeSetup { /* */
  return TradeSetup.updateStatus(id,success);
}

export function createTrader(name:string,winrate:u32): Trader {
  return Trader.insert(name,winrate);
}

export function isTrader(id: string): bool { /* */
  return Trader.doesContainsAccId(id);
}
