import { Button } from "antd"
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"
import { utils } from "near-api-js"
import { useState,useEffect } from "react";
import { useContract } from "../../contexts/contractContext";


export default function Setup({ ...setup }) {
  const {contract,currentUser} = useContract()
  const navigate = useNavigate()
  const [hasPerm,setHasPerm] = useState(false) //User must be setup owner (Trader) or Subscriber to see the setup
  const [isSetupDonatable,setIsSetupDonatable] = useState(false)
  const [isSetupEditable,setIsSetupEditable] = useState(false)
  const setupStatus = setup.status.isOpen?"active":setup.status.success?"success":"fail"
  const setupStyle = setup.status.isOpen?styles.active:setup.status.success?styles.success:styles.fail
  const placeholder = "https://www.tradingview.com/x/hXy83lqk/"
  console.log(setup)
  useEffect(() => {
    setHasPerm(setup.owner === currentUser?.accountId || setup.subs.includes(currentUser?.accountId) || !setup.status.isOpen)    
    setIsSetupDonatable(setup.subs.includes(currentUser?.accountId) && setupStatus === "success" && true)
    setIsSetupEditable((currentUser?.accountId === setup.owner && setup.status.isOpen) && true)
  }, [currentUser,setup.status])
  

  const deleteSetup = () => {
    contract.deleteSetup({ id: setup.id });
  };

  const subToSetup = () => {
    contract.addSubToSetup({ id: setup.id },
      "300000000000000", utils.format.parseNearAmount("1"));
  };

  const donateTrader = () => {
    contract.donateTraderBySetupId({ id: setup.id },
      "300000000000000", utils.format.parseNearAmount("10"));
  };

  const editSetup = () => {
    navigate(`/editSetup/${setup.id}`)
  }

  return (
    <div className={styles.setup}>
      <img className={styles.chart} alt="example" src={hasPerm ? setup.chart : placeholder} />

      <div className={`${styles.wrapper} ${setupStyle}`}>

        <div className={styles.title}>{setup.pair}</div>

        <div className={styles.trader}>
          <div>{setup.trader.name}</div>
          <div>{setup.trader.winrate}</div>
        </div>

        <div className={styles.side}>
          {setup.side}
        </div>

        <div className={styles.riskRewardRatio}>
          {setup.riskRewardRatio}
        </div>

        <div className={styles.subContentWrapper}>  
        {hasPerm && 
          <>
            <div className={styles.subContent} data-level="Entry Price">
            {setup.entryPrice}
            </div>

            <div className={styles.subContent} data-level="Stop Loss Price">
              {setup.stopLossPrice}
            </div>

            <div className={styles.subContent} data-level="Take Profit Price">
              {setup.takeProfitPrice}
            </div>

            <div className={styles.subContent} data-level="Status">
              {setupStatus}
            </div>
          </>
          }
          </div>

        <div className={styles.buttons}>
            {isSetupEditable 
              && <Button onClick={editSetup} style={{ width: "100px" }}>Edit</Button>
            }

            {isSetupEditable
              && <Button onClick={deleteSetup} style={{ width: "100px" }}>Delete</Button>
            }

          
            {!hasPerm
              && <Button onClick={subToSetup} style={{ width: "100px" }}>Pay to See</Button>
            }
          

            {isSetupDonatable
              && <Button onClick={donateTrader} style={{ width: "100px" }}>Donate</Button>
            }
        </div>

      </div>
    </div>
  );
}