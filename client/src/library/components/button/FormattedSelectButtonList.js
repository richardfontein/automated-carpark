import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

import SelectButtonList from './SelectButtonList';

export default function FormattedSelectButtonList({
 keyList, onSelect, description, show, 
}) {
  if (!keyList || show === false) {
    return null;
  }

  return (
    <Col lg="auto" className="select-button-list-wrapper">
      <Row noGutters>
        {description ? (
          <Col md="auto" className="description">
            {description}
          </Col>
        ) : null}
        <Col xs="auto">
          <SelectButtonList keyList={keyList} onSelect={onSelect} />
        </Col>
      </Row>
    </Col>
  );
}

FormattedSelectButtonList.defaultProps = {
  onSelect: null,
  description: '',
  show: true,
};

FormattedSelectButtonList.propTypes = {
  keyList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
  description: PropTypes.string,
  show: PropTypes.bool,
};
