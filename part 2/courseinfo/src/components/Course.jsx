
const Course = ({ course }) => {
    const total = course.parts.reduce((sum, part) => {
        return sum + part.exercises
    }, 0)

    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <b>total of {total} exercises</b>
        </div>
    )
}

const Header = ({ course }) => <h2>{course}</h2>

const Content = ({ parts }) => (
    <div>
        {parts.map(part =>
            <Part key={part.id} part={part} />
        )}
    </div>
)

const Part = ({ part }) => (
    <p>
        {part.name} {part.exercises}
    </p>
)
export default Course