import { NavLink } from 'react-router-dom';
import { useContract } from '../../contexts/contractContext';
import { useCurrentUser } from '../../contexts/userContext';
import styles from "./styles.module.css"

export default function Navbar() {
  const { isUserTrader } = useCurrentUser()
  const {wallet,currentUser,nearConfig} = useContract()
  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'Copy Trading With Near'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <div className={styles.navbar}>

      <h1>Copy Trading With Near</h1>
      <div className={styles.navLinks}>
        <NavLink to="/">
          Home
        </NavLink>
        {
          isUserTrader
            ?
            <NavLink to="/createSetup">
              Create Setup
            </NavLink>
            :
            <NavLink to="/createTrader">
              Are you a Trader?
            </NavLink>
        }

        <a onClick={currentUser ? signOut : signIn}>{currentUser ? "Logout" : "Login"}</a>
      </div>

    </div>
  )
}
