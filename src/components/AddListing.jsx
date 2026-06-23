// Change the listing letters to white when selected
// Add logic to turn selected option yellow
const AddListing = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    return (
        <div>
            <ul>
                {options.map(option => (
                    <li
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        style={{
                            color: selectedOption === option ? 'white' : 'black',
                            backgroundColor: selectedOption === option ? 'yellow' : 'transparent'
                        }}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};