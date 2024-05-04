const marketplaceABI = [[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "ItemListed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			}
		],
		"name": "purchaseItem",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "relistItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			}
		],
		"name": "getItem",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "items",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "available",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]]

//############################################################# CONNECTING 


window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            document.getElementById('walletAddress').innerText = 'Connected Wallet: ' + accounts[0];
        } catch (error) {
            console.error(error);
        }
    } else {
        document.getElementById('walletAddress').innerText = 'Please install MetaMask to connect your wallet.';
    }
});

//############################################################# LISTING 

// Function to handle the list item button click
document.getElementById('listItem').addEventListener('click', async () => {
    console.log('List Item button clicked'); // Logging to check if the button is clicked

    // Add code to list item
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const priceInEther = parseFloat(priceInput.value); // Get the price from input field as a float
    const priceInWei = web3.utils.toWei(priceInEther.toString(), 'ether'); // Convert the price to Wei

    if (title === '' || description === '' || isNaN(priceInEther) || priceInEther <= 0) {
        document.getElementById('message').innerText = 'Please enter valid values for title, description, and price.';
        return;
    }

    try {
        // Call the listItem function to list the item with the price in Wei
        await listItem(title, description, priceInWei);
        document.getElementById('message').innerText = 'Item listed successfully.';
        // Clear input fields after listing item
        titleInput.value = '';
        descriptionInput.value = '';
        priceInput.value = '';
    } catch (error) {
        console.error('Error listing item:', error);
        document.getElementById('message').innerText = 'An error occurred while listing item.';
    }
});

async function listItem(title, description, price) {
    const itemMarketplaceABI = [
        // Simplified ABI with only the methods we'll interact with
        {
            "constant": false,
            "inputs": [{"name": "_title", "type": "string"}, {"name": "_description", "type": "string"}, {"name": "_price", "type": "uint256"}],
            "name": "listItem",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]; // Add the ABI here

    const itemMarketplaceContractAddress = '0x3Eb85eE8c9e888e5FFC55Dd2f9F78726c2787D11'; // Update with your contract address

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const itemMarketplace = new web3.eth.Contract(itemMarketplaceABI, itemMarketplaceContractAddress);
        const transaction = itemMarketplace.methods.listItem(title, description, price);
        const gas = await transaction.estimateGas({ from: accounts[0] });
        const gasPrice = await web3.eth.getGasPrice();
        const options = {
            from: accounts[0],
            to: itemMarketplaceContractAddress,
            data: transaction.encodeABI(),
            gas: gas,
            gasPrice: gasPrice
        };
        const signedTx = await web3.eth.sendTransaction(options);
        console.log('Transaction receipt:', signedTx);
    } catch (error) {
        console.error('Error listing item:', error);
        throw error;
    }
}

// REMDERING/// Function to check if an item exists in the contract
async function checkIfItemExists(title) {
    const marketplaceABI = [
        // Add the ABI of your smart contract here
        // You may need to include more functions if required
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                }
            ],
            "name": "getItem",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "available",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const marketplaceContractAddress = '0x3Eb85eE8c9e888e5FFC55Dd2f9F78726c2787D11'; // Update with your contract address
    const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceContractAddress);

    try {
        const item = await marketplaceContract.methods.getItem(title).call();
        if (item.title !== '' && item.available) {
            return item;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error;
    }
}

// Function to display whether the item exists and its description
async function displayItemExistence() {
    const checkTitleInput = document.getElementById('checkTitle');
    const title = checkTitleInput.value.trim();

    if (title === '') {
        document.getElementById('itemExistsMessage').innerText = 'Please enter a title.';
        return;
    }

    try {
        const item = await checkIfItemExists(title);
        if (item !== null) {
            const message = `Item exists. Description: ${item.description}. Price: ${web3.utils.fromWei(item.price, 'ether')} ETH`;
            document.getElementById('itemExistsMessage').innerText = message;
        } else {
            document.getElementById('itemExistsMessage').innerText = 'Item does not exist or is not available.';
        }
    } catch (error) {
        console.error('Error displaying item existence:', error);
        document.getElementById('itemExistsMessage').innerText = 'An error occurred while checking item existence.';
    }
}

// Call displayItemExistence() when the "Check If Item Exists" button is clicked
document.getElementById('checkItem').addEventListener('click', displayItemExistence);





//############################################################ PURCHASING

async function purchaseItem(title, price) {
    const marketplaceABI = [
        // Add the ABI of your smart contract here
        // You may need to include more functions if required
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                }
            ],
            "name": "purchaseItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ];
    const marketplaceContractAddress = '0x3Eb85eE8c9e888e5FFC55Dd2f9F78726c2787D11'; // Update with your contract address
    const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceContractAddress);
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const transaction = marketplaceContract.methods.purchaseItem(title);
        const gas = await transaction.estimateGas({ from: accounts[0], value: price });
        const gasPrice = await web3.eth.getGasPrice();
        const options = {
            from: accounts[0],
            to: marketplaceContractAddress,
            data: transaction.encodeABI(),
            gas: gas,
            gasPrice: gasPrice,
            value: price
        };
        const receipt = await web3.eth.sendTransaction(options);
        console.log('Transaction receipt:', receipt);
        return receipt.transactionHash;
    } catch (error) {
        console.error('Error purchasing item:', error);
        return null;
    }
}



// async function purchaseItem(title, price) {
//     const marketplaceABI = [
//         // Add the ABI of your smart contract here
//         // You may need to include more functions if required
//         {
//             "inputs": [
//                 {
//                     "internalType": "string",
//                     "name": "_title",
//                     "type": "string"
//                 }
//             ],
//             "name": "purchaseItem",
//             "outputs": [],
//             "stateMutability": "payable",
//             "type": "function"
//         }
//     ];
//     const marketplaceContractAddress = '0x3Eb85eE8c9e888e5FFC55Dd2f9F78726c2787D11'; // Update with your contract address
//     const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceContractAddress);
    
//     try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const transaction = marketplaceContract.methods.purchaseItem(title);
//         const gas = await transaction.estimateGas({ from: accounts[0], value: price });
//         const gasPrice = await web3.eth.getGasPrice();
//         const options = {
//             from: accounts[0],
//             to: marketplaceContractAddress,
//             data: transaction.encodeABI(),
//             gas: gas,
//             gasPrice: gasPrice,
//             value: price
//         };
        
//         // Get the seller's address from the contract before sending the transaction
//         const seller = await marketplaceContract.methods.items(title).call();
//         options.to = seller.seller; // Set the recipient address to the seller's address
        
//         const receipt = await web3.eth.sendTransaction(options);
//         console.log('Transaction receipt:', receipt);
//         return receipt.transactionHash;
//     } catch (error) {
//         console.error('Error purchasing item:', error);
//         return null;
//     }
// }


// Function to handle the purchase item button click
document.getElementById('purchaseItem').addEventListener('click', async () => {
    const purchaseTitleInput = document.getElementById('purchaseTitle');
    const title = purchaseTitleInput.value.trim();

    if (title === '') {
        document.getElementById('purchaseMessage').innerText = 'Please enter a title.';
        return;
    }

    try {
        // Fetch item details to get its price
        const item = await checkIfItemExists(title);
        if (item && item.title !== '') {
            const price = item.price;
            // Check if the user has enough funds
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const balance = await web3.eth.getBalance(accounts[0]);
            if (Number(balance) < price) {
                document.getElementById('purchaseMessage').innerText = 'Insufficient funds to purchase item.';
                return;
            }
            // Purchase the item
            const receipt = await purchaseItem(title, price);
            if (receipt) {
                document.getElementById('purchaseMessage').innerText = `Item purchased successfully. Transaction hash: ${receipt}`;
            } else {
                document.getElementById('purchaseMessage').innerText = 'Failed to purchase item.';
            }
        } else {
            document.getElementById('purchaseMessage').innerText = 'Item does not exist.';
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
        document.getElementById('purchaseMessage').innerText = 'An error occurred while purchasing item.';
    }
});
