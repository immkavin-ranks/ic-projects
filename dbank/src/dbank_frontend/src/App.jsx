import { dbank_backend } from 'declarations/dbank_backend';
import { useEffect, useState } from 'react';

function App() {

  const [balance, setBalance] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');

  const fetchBalance = async () => {
    const newBalance = await dbank_backend.checkBalance();
    setBalance(newBalance);
  }

  useEffect(() => {

    fetchBalance();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.querySelector('#submit-btn').disabled = true;

    const topUpAmount = parseFloat(inputAmount) || 0;
    const withdrawAmount = parseFloat(outputAmount) || 0;

    await dbank_backend.topUp(topUpAmount);
    await dbank_backend.withdraw(withdrawAmount);

    await dbank_backend.compound(); // bug: this should be called when balance is updated

    fetchBalance();
    setInputAmount('');
    setOutputAmount('');
    e.target.querySelector('#submit-btn').disabled = false;
  }

  function handleChange(e) {

    const { name, value } = e.target;
    if (name === "topUp") {
      setInputAmount(value);
    } else if (name === "withdraw") {
      setOutputAmount(value);
    }

  }

  return (
    <main>
      <div className="container">
        <img src="/logo.png" alt="DBank logo" width="100" />
        <h1>Current Balance: $<span id="value">{balance.toFixed(2)}</span></h1>
        <div className="divider"></div>

        <form onSubmit={handleSubmit}>
          <h2>Amount to Top Up</h2>
          <input id="input-amount" type="number" step="0.01" min='0' name="topUp" value={inputAmount} onChange={handleChange} />
          <h2>Amount to Withdraw</h2>
          <input id="withdrawal-amount" type="number" name="withdraw" step="0.01" min='0' value={outputAmount} onChange={handleChange} />
          <input id="submit-btn" type="submit" value="Finalise Transaction" />
        </form>
      </div>
    </main>
  );
}

export default App;
