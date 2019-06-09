import React from 'react';

import './MtgCard.css'

export default class MtgCard extends React.Component {

    state = {
        face: 0
    }

    render() {
        if(this.props.card_faces)
            return (
                <div className='MtgCard'>
                    {this.props.name + ": $" + this.props.prices.usd}
                    <img src={this.props.card_faces[this.state.face].image_uris.png} alt={this.props.name} onMouseOver={() => this.setState({ face: (this.state.face === 0)? 1: 0 })} />
                </div>
            );
        else
            return (
                <div className='MtgCard'>
                    <span>{this.props.name + ": $" + this.props.prices.usd}</span>
                    <img src={this.props.image_uris.png} alt={this.props.name}/>
                </div>
            );
    }

}