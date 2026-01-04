import {useState} from "react";

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGood = () => {
        setGood(good+1)

    }
    const handleBad = () => {
        setBad(bad+1)
    }
    const handleNeutral = () => {
        setNeutral(neutral+1)
    }

    // Calculate derived statistics
    const all = good + neutral + bad;

    // Calculate average (avoid division by zero)
    const average = all === 0 ? 0 : (good - bad) / all;

    // Calculate percentage of positive feedback
    const positivePercentage = all === 0 ? 0 : (good / all) * 100;
    return (
        <div>
            <h2>Give Feedback</h2>
            <div>
                <button onClick={handleBad}>Bad</button>
                <button onClick={handleGood}>Good</button>
                <button onClick={handleNeutral}>Neutral</button>
            </div>

            <h2>Statistics</h2>
            <p>good {good}</p>
            <p>neutral {neutral}</p>
            <p>bad {bad}</p>
            <p>all {all}</p>
            <p>average {average}</p>
            <p>positive {positivePercentage} %</p>
        </div>
    )
}

export default App