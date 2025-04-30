import React, { useState } from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types'; 


const SuggestionInput = (props) => {


    return  (
        <div>

            {props.suggestions?.length > 0 && (
                <div style={{ margin:"5px",display:"flex"}}>
                    {props.suggestions.map((suggestion, index) => (
                        <Badge
                          className='me-1 font-size-13 p-3'
                            color="primary"
                            key={index}
                            onClick={() => props.handleSuggestionClick(suggestion)}
                            style={{ padding: '8px', cursor: 'pointer' }}
                            onMouseDown={(e) => e.preventDefault()} // Prevent losing focus on input
                            pill
                        >
                            {suggestion}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};

SuggestionInput.propTypes = {
    suggestions: PropTypes.array,
    handleSuggestionClick: PropTypes.func,
 };

export default SuggestionInput;
