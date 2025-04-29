const contractAddress = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

let signer;
let contract;

document.getElementById("connect").onclick = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    document.getElementById("wallet").textContent = address;

    contract = new ethers.Contract(contractAddress, abi, signer);

    const balance = await contract.balanceOf(address);
    const formatted = ethers.utils.formatUnits(balance, 18);
    document.getElementById("balance").textContent = formatted;
  } else {
    alert("Please install MetaMask!");
  }
};

document.getElementById("send").onclick = async () => {
  const to = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;

  const parsed = ethers.utils.parseUnits(amount, 18);

  try {
    const tx = await contract.transfer(to, parsed);
    document.getElementById("status").textContent = "Sending...";
    await tx.wait();
    document.getElementById("status").textContent = "Transfer complete!";
  } catch (err) {
    document.getElementById("status").textContent = "Error: " + err.message;
  }
};
