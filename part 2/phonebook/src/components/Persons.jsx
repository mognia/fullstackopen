import React from 'react';

const Persons = ({ personsToShow }) => (
    <div>
        {personsToShow.map(person => (
            <p key={person.name}>
                {person.name} {person.number}
            </p>
        ))}
    </div>
)
export default Persons;