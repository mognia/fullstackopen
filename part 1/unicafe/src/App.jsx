import { useState } from "react";

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    return (
        <div>
            <h2>Give Feedback</h2>
            <div>
                <Button handleClick={() => setGood(good + 1)} text="Good" />
                <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
                <Button handleClick={() => setBad(bad + 1)} text="Bad" />
            </div>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

const StatisticLine = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
);

const Statistics = ({ good, neutral, bad }) => {
    const all = good + neutral + bad;
    const average = all === 0 ? 0 : (good - bad) / all;
    const positivePercentage = all === 0 ? 0 : (good / all) * 100;

    if (all === 0) {
        return (
            <div>
                <h2>Statistics</h2>
                <p>No feedback given</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Statistics</h2>
            <table>
                <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={all} />
                <StatisticLine text="average" value={average.toFixed(1)} />
                <StatisticLine text="positive" value={positivePercentage.toFixed(1) + " %"} />
                </tbody>
            </table>
        </div>
    );
};

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
);
export default App;