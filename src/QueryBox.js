import React, { Component } from 'react';
import PropTypes from 'prop-types';

QueryBox.propTypes = {
    id: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired
};

class QueryBox extends Component {
   onQueryChange = (query) => {
      this.props.updateQuery(query)
   }

   render() {
      return (
         <input
            id = {this.props.id}
            tabIndex = '0'
            className = "query-input"
            type = "text"
            placeholder = "Filter locations by names or keywords"
            value = {this.props.query}
            onChange = {(event) => this.onQueryChange(event.target.value)}
         />
      )
   }
}

export default QueryBox;