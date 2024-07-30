import { useEffect, useState } from "react";
import "./styles.css";
import { numberWithCommas } from "./utils/config";
import { tenureData } from "./utils/constants";

export default function App() {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  const calculateEMI = (downpayment) => {
    //Emi amount= [p*r*(1+r)^n]/[(1+r)^n-1]
    if (!cost) return;

    const loanAmt = cost - downpayment;
    const rateOfInterest = interest / 100;
    const numOfYear = tenure / 12;

    const EMI =
      (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYear) /
      ((1 + rateOfInterest) ** numOfYear - 1);
    return Number(EMI / 12).toFixed(0);
  };

  const calculateDP = (emi) => {
    if (!cost) return;
    const downPaymentPercent = 100 - (emi / calculateEMI(0)) * 100;
    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };

  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayment(0);
      setEmi(0);
    }
    const emi = calculateEMI(downPayment);
    setEmi(emi);
  }, [tenure, cost]);

  const updateEMI = (e) => {
    if (!cost) return;
    const dp = Number(e.target.value);
    setDownPayment(dp.toFixed(0));
    const emi = calculateEMI(dp);
    setEmi(emi);
    //Calculate emi and update it
  };

  const updateDownPayment = (e) => {
    if (!cost) return;
    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));
    const dp = calculateDP(emi);
    setDownPayment(dp);
    //calculate DP and update it
  };

  return (
    <div className="App">
      <span className="title" style={{ fontSize: 30, marginTop: 2 }}>
        EMI CALCULATOR
      </span>
      <span className="tittle">Total Cost of Asset </span>
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="Total Cost of Asset"
      />
      <span className="tittle">Interest Rate (in %) </span>
      <input
        type="number"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        placeholder="Interest Rate (in %)"
      />
      <span className="tittle">Processing fee (in %) </span>
      <input
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        placeholder="Processing Fee (in %)"
      />

      <span className="title">Down Payment</span>
      <span className="title" style={{ textDecoration: "underline" }}>
        {" "}
        Total Down Payment-
        {(Number(downPayment) + (cost - downPayment) * (fee / 100)).toFixed(0)}
      </span>
      <div>
        <input
          type="range"
          min={0}
          max={cost}
          className="slider"
          value={downPayment}
          onChange={updateEMI}
        />
        <div className="labels">
          <label>0%</label>
          <b>{numberWithCommas(downPayment)}</b>
          <label>100%</label>
        </div>
      </div>
      <span className="title">Loan per Month</span>
      <span className="title" style={{ textDecoration: "underline" }}>
        {" "}
        Total Loan Amount - {(emi * tenure).toFixed(0)}
      </span>
      <div>
        <input
          type="range"
          min={calculateEMI(cost)}
          max={calculateEMI(0)}
          className="slider"
          value={emi}
          onChange={updateDownPayment}
        />
        <div className="labels">
          <label> {numberWithCommas(calculateEMI(cost))}</label>
          <b>{numberWithCommas(emi)}</b>
          <label> {numberWithCommas(calculateEMI(0))}</label>
        </div>
      </div>
      <span className="title">Tenure</span>
      <div className="tenureContainer">
        {tenureData.map((t) => {
          return (
            <button
              className={`tenure ${t === tenure ? "selected" : ""}`}
              onClick={() => setTenure(t)}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
