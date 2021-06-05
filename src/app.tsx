import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from './view/main-container';

function render() {
    ReactDOM.render(<MainContainer />, document.getElementById('app'));
}

render();
