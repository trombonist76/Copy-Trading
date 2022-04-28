[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$TRADER_ACCOUNT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$CUSTOMER_ACCOUNT" ] && echo "Missing \$CONTRACT environment variable"

# You must login at least 2 testnet accounts to try smart contrat functions with near login

echo "deleting $CONTRACT"
echo
near delete $CONTRACT 

echo "deleting $TRADER_ACCOUNT"
echo
near delete $TRADER_ACCOUNT 

echo "deleting $CUSTOMER_ACCOUNT"
echo
near delete $CUSTOMER_ACCOUNT 

echo --------------------------------------------
echo
echo "cleaning up the /neardev folder"
echo
rm -rf ./neardev

# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "rebuilding the contract"
echo
yarn build

echo --------------------------------------------
echo
echo "redeploying the contract"
echo
yarn deploy

echo --------------------------------------------
echo "Step 3: Prepare your environment for next steps"
echo
echo "(a) find the contract (account) name in the message above"
echo "    it will look like this: [ Account id: dev-###-### ]"
echo
echo "(b) set an environment variable using this account name"
echo "    see example below (this may not work on Windows)"
echo
echo
echo "export CONTRACT=dev-123-456 / your-wallet-name.testnet"
echo "export TRADER_ACCOUNT=dev-123-456 / your-wallet-name.testnet"
echo "export CUSTOMER_ACCOUNT=dev-123-456 / your-wallet-name.testnet"

exit 0