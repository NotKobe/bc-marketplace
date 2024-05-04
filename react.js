import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import YourContractABI from './YourContractABI.json'; // Import the ABI of your smart contract
import { yourContractAddress } from './config'; // Import the address of your deployed contract

const ItemListingApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Connect to MetaMask or any Ethereum provider
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        console.error('MetaMask not detected');
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (web3) {
      // Instantiate the smart contract
      const contractInstance = new web3.eth.Contract(
        YourContractABI,
        yourContractAddress
      );
      setContract(contractInstance);
    }
  }, [web3]);

  const listNewItem = async (title, description, price) => {
    try {
      await contract.methods.listItem(title, description, price).send({
        from: account,
        gas: 3000000, // Adjust gas as needed
      });
      alert('Item listed successfully!');
    } catch (error) {
      console.error('Error listing item:', error);
    }
  };

  const purchaseItem = async (itemId, price) => {
    try {
      await contract.methods.purchaseItem(itemId).send({
        from: account,
        value: price,
        gas: 3000000, // Adjust gas as needed
      });
      alert('Item purchased successfully!');
    } catch (error) {
      console.error('Error purchasing item:', error);
    }
  };

  return (
    <div>
      {/* UI for listing items */}
      <button onClick={() => listNewItem('Item Title', 'Item Description', 100)}>List Item</button>

      {/* UI for purchasing items */}
      <button onClick={() => purchaseItem(itemId, itemPrice)}>Purchase Item</button>
    </div>
  );
};

export default ItemListingApp;
