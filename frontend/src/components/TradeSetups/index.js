import { useEffect, useState } from 'react'
import { useContract } from '../../contexts/contractContext'
import Setup from '../Setup'
import styles from './styles.module.css'

const PER_PAGE_LIMIT = 10

const TradeSetups = () => {
  const { contract } = useContract()
  const [setups, setSetups] = useState([])
  const [page, setPage] = useState(1)

  const compareFunc = (a, b) => {
    const setupStatus = (setup) => setup.status.isOpen ? 2 : setup.status.success ? 1 : 0
    return setupStatus(b) - setupStatus(a)

  }
  useEffect(() => {

    let offset
    if (page < 1) {
      setPage(1)
      offset = 0
    } else {
      offset = (page - 1) * PER_PAGE_LIMIT
    }

    const interval = setInterval(() => {
      contract
        .getSetups({ offset, limit: PER_PAGE_LIMIT })
        .then((tradeSetups) => setSetups(tradeSetups.sort(compareFunc)))
    }, 1000)

    return () => clearInterval(interval)

  }, [page,contract])

  return (
    <div className={styles.setups}>
      {setups.map((setup) => (
        <div key={setup.id}>
          <Setup {...setup}/>
        </div>
      ))}
    </div>
  )
}

export default TradeSetups
