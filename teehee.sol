// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    // Structure to represent an item
    struct Item {
        string title;
        string description;
        uint256 price;
        address seller;
        bool available;
    }

    

    // Mapping to store items
    mapping(string => Item) public items;
    
    // Event to emit when an item is listed
    event ItemListed(string title, uint256 price, address seller);
    
    // Function to list an item
    function listItem(string memory _title, string memory _description, uint256 _price) public {
        require(!itemExists(_title), "Item with this title already exists");
        items[_title] = Item(_title, _description, _price, msg.sender, true);
        emit ItemListed(_title, _price, msg.sender);
    }



    // Function to purchase an item
    // function purchaseItem(string memory _title) public payable {
    //     require(itemExists(_title), "Item does not exist");
    //     require(items[_title].available, "Item is not available");
    //     require(msg.value >= items[_title].price, "Insufficient funds");
        
    //     // Transfer funds to the seller
    //     payable(items[_title].seller).transfer(msg.value);
        
    //     // Mark the item as unavailable
    //     items[_title].available = false;
    // }

    // Function to purchase an item
function purchaseItem(string memory _title) public payable {
    require(itemExists(_title), "Item does not exist");
    require(items[_title].available, "Item is not available");
    require(msg.value >= items[_title].price, "Insufficient funds");
    
    // Transfer funds to the seller
    payable(items[_title].seller).transfer(msg.value);
    
    // Mark the item as unavailable
    items[_title].available = false;
}


// Function to relist an item
function relistItem(string memory _title, string memory _description, uint256 _price) public {
    require(!itemExists(_title), "Item with this title already exists");
    items[_title] = Item(_title, _description, _price, msg.sender, true);
    emit ItemListed(_title, _price, msg.sender);
}


    // Function to check if an item exists
    function itemExists(string memory _title) internal view returns (bool) {
    return items[_title].available;
}


    

    // Function to retrieve item details
    function getItem(string memory _title) public view returns (string memory, string memory, uint256, address, bool) {
        return (items[_title].title, items[_title].description, items[_title].price, items[_title].seller, items[_title].available);
    }
    receive() external payable { }

    
}
