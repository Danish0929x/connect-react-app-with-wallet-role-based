import React, { useState, useEffect } from 'react'
import {ethers} from 'ethers';
import data from './admindata'


function WalletCard() {

  //State variables

    const [errorMessage, setErrorMessage] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [userBalance, setUserBalance] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [currentRole, setCurrentRole] = useState('')



    //Connection function

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangehandler(result[0]);

            })
        } else {
            setErrorMessage('Install Metamask!!')
        }
    } 


    //Account change handler function
    const accountChangehandler = (newAccount) =>{
      setDefaultAccount(newAccount);
      getUserbalance(newAccount.toString())

      
    }

    //Getting balance of current address function

    const getUserbalance = (address) => {
      window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
      .then(balance => {
        //COnverting the balance using ethers library
        setUserBalance(ethers.utils.formatEther(balance));
      })
    }

    const chainChangedHandler = () => {
      window.location.reload();
    }


    //Role base displaying the content
    useEffect(() => {
      console.log('useEffect called with defaultAccount:', defaultAccount);
      if(Array.isArray(defaultAccount)){
        if(data.includes(defaultAccount[0])){
          setCurrentRole('admin')
        } else if(defaultAccount == null){
          setCurrentRole('')
        } else {
          setCurrentRole('user')
        } }
        else {
          if(data.includes(defaultAccount)){
            setCurrentRole('admin')
          } else if(defaultAccount == null){
            setCurrentRole('')
          } else {
            setCurrentRole('user')
          }
        }
      
     
    }, [defaultAccount]);

    //Calling the account change handler function on changing of user using metamask
    window.ethereum.on('accountsChanged', accountChangehandler)
    window.ethereum.on('chainChanged', chainChangedHandler)



  return (
    <div>
    <div className='wallet-card'>
      <h4>{"Connection to Metamask using windows.ethereum methods"}</h4>
      {defaultAccount === null && <button onClick={connectWalletHandler}>{connButtonText}</button>}
      <div className='account-display'>
        {defaultAccount !== null && <h3>Address: {defaultAccount}</h3>}
      </div>
      <div className='balance-display'>
        {defaultAccount !== null && <h3>Balance: {userBalance}</h3>}
      </div>
      {errorMessage}
    </div>
      {currentRole === 'user' && <div className='current-role-user'>
          Content that visible to user
      </div>}
      {currentRole === 'admin' && <div className='current-role-admin'>
          Content that visible to Admin
      </div>}

    </div>
  )
}

export default WalletCard
