import React from 'react';

import './MtgCard.css'

export default class MtgCard extends React.Component {

    render() {
        return (
            <div className='MtgCard'>
                {this.props.name}
            </div>
        );
    }

}