# Project Design

On the webpage, you'll see 3 main sections: a **connect wallet** button, which prompts the metaMask login if it doesn't automatically do it. A **list item** section, where you provide a title, description and price in Sepolia of whatever item you listed. A **check item** tab, where you can enter the title you are looking for and see if it already exists on the market place. A **purchase item** tab, where you input the title (if it exists) and if you have enough coins in your accout you can purchase it. Also I was having some problems getting this HTTPS encrypted on Google Cloud with Let's Encrypt so I took the easy way out and just used GitHub pages since they offer HTTPS encryption and I already need to host the files on github anyways to turn it in lol.

I couldn't figure out a way to render all of the items of the blockchain (due to my smart contract design), so you can use the **check item** to verify if your item exists on the block chain. Just note that it is case-sensitive (i.e items Rich != rich).

As of writing this report, some items you can look at are:

> rich
> teehee
> asdf

You can view the items with the **check items** button 

# Challenges faced

The biggest challenge that I faced was probably designing the smart contract, because when I made my first draft, I had the ability to list the item, but I didn't define a good way to check if the item was bought or not. And another aspect that I struggled with was finding out what parts of the contract ABI I need for my javascript code, since it was a JSON dictionary with lots of levels, and if I made my Smart Contract with more functions, then the ABI would be even longer so I wanted to keep it short. 

Another challenge that I had was that I noticed that initially, I would list an item for a price, but then it would be much cheaper than it was listed. Then I realized I was listing the price in Wei, so I had to do a quick conversion. Another issue I had was figuring out a logic to see if an item had already been purchased, so I just added a boolean value as part of the struct in the smart contract, but because I did that I had to get a new smart contract address to test with. 

Another small challenge was also figuring out how to use Remix to launch/monitor smart contracts since I did so many iterations of my smart contract, it was hard to keep track of sense I wasn't used to remix. 

# Solutions to challenges

The main solution I did for my smart contract was to keep it as simple as possible, which meant that I needed only the basic functions, which are purchasing, listing and accessing the values within the item struct (which defines what each item is with a title, description, price and boolean). By keeping the smart contract as simple as possible, it was easy to figure out what I needed from the contract ABI.

Then like mentioned earlier, I used a boolean to keep track of the availibilty of the item, because initially I was thinking of storing it as a statevariable, but then I realized that made no sense since the item would ultimtaely be stored as information on the blockchain. 
