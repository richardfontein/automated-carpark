import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default function SelectButtonList({ keyList, onSelect }) {
  const [active, setActive] = useState(keyList[0]);

  const handleSelect = (key) => {
    setActive(key);
    if (onSelect) onSelect(key);
  };

  if (!keyList) {
    return null;
  }

  return (
    <>
      {keyList.map(key => (
        <Button
          key={key}
          size="sm"
          variant={active === key ? 'primary' : 'secondary'}
          onClick={() => {
            handleSelect(key);
          }}
        >
          {key}
        </Button>
      ))}
    </>
  );
}

SelectButtonList.defaultProps = {
  onSelect: null,
};

SelectButtonList.propTypes = {
  keyList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
};
