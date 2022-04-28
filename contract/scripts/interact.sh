#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Call 'view' functions on the contract"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo
echo  "please add two testnet account. One will be a trader and the other one will be a customer."
echo
echo  "set a trader"

near call $CONTRACT createTrader '{
      "name": "Trombrother",
      "winrate": 76
 }' --accountId $TRADER_ACCOUNT

echo --------------------------------------------
echo
# If you want to create a setup you must be a trader 
echo 
echo  "set a setup"

near call $CONTRACT createSetup '{
      "pair": "BTCUSDTPERP",
      "chart": "https://www.tradingview.com/x/2oBkS8AZ/", 
      "side": "Long",
      "entryPrice": "2",
      "stopLossPrice": "1",
      "takeProfitPrice":"4",
      "riskRewardRatio":"2"

 }' --accountId $TRADER_ACCOUNT

echo --------------------------------------------
echo
echo  "get setup"
echo

near view $CONTRACT getSetupById '{"id":1406034228}' --accountId $TRADER_ACCOUNT

echo
echo --------------------------------------------
echo "get setups"
echo

near view $CONTRACT getSetups '{"offset":0, "limit":100}' --accountId $TRADER_ACCOUNT

echo 
echo --------------------------------------------
# If you want to update setup you must be setup owner(creator) 
echo  "update setup"
echo

near call $CONTRACT updateSetup '{
        "id":1406034228,
        "updates":{
            "chart":"https://www.tradingview.com/x/2oBkS8AZ/",
            "entryPrice":"2",
            "stopLossPrice":"1.5",
            "takeProfitPrice":"4",
            "riskRewardRatio":"4"
          }
        }' --accountId $TRADER_ACCOUNT

echo --------------------------------------------
# If you want to subscribe to setup you must deposit at least 1 NEAR
echo  "Add Subscriber To Setup"
echo

near call $CONTRACT addSubToSetup '{"id":1406034228}' --accountId $CUSTOMER_ACCOUNT --deposit 1

echo
echo --------------------------------------------
echo
echo  "Update Setup Status"
echo

near call $CONTRACT updateSetupStatus '{"id":1406034228,"success":true}' --accountId $TRADER_ACCOUNT

echo
echo --------------------------------------------
echo  "Donate Trader"
echo

near call $CONTRACT donateTraderBySetupId '{"id":1406034228}' --accountId $CUSTOMER_ACCOUNT --deposit 10

echo
echo --------------------------------------------
echo "now run this script again to see changes made by this file"
exit 0