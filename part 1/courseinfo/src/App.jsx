const App = () => {
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14

    const parts = [
        {partName: part1, exercises: exercises1},
        {partName: part2, exercises: exercises2},
        {partName: part3, exercises: exercises3},
    ]
    return (
        <div>
            <Header headerText={course}/>
            <Content parts={parts}/>
            <Total total={exercises1 + exercises2 + exercises3} />
        </div>
    )
}

const Header = ({headerText}) => {
    return (<h1>{headerText}</h1>)
}
const Content = ({parts}) => {
    return (
        <>
            <div>

                {parts.map((item, index) => (

                    <Part partItem={item} key={index}/>
                ))}
            </div>
        </>
    )
}
const Total = ({ total }) => {
    return <p>Number of exercises {total}</p>
}

const Part = ({partItem}) => {
    return (
        <p>
            {partItem.partName} {partItem.exercises}
        </p>
    )
}
export default App