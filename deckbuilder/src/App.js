import React from 'react';
import { Button } from '@material-ui/core';

import MtgCard from './components/MtgCard';

import './App.css';

let text = "";
const numOfFiles = 3;

export default class App extends React.Component {

    state = {
        value: "",
        cards: [],
        file: numOfFiles,
        numOfFiles: numOfFiles
    };

    readTextFile = file => {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    console.log("allText: ", allText);
                    text = allText;
                }
            }
        };
        rawFile.send(null);
    };

    componentWillMount() {
        this.switchFile();
    }

    switchFile = () => {
        this.setState({ file: this.state.file%numOfFiles + 1, cards: [] }, () => {
            this.readTextFile("./cardlist" + this.state.file + ".txt");
            let arr = text.split('\n');
            console.log(arr);
            let index = 0;
            let interval = setInterval(() => {
                console.log(index)
                if(index >= arr.length) {
                    if(this.state.cards.length == arr.length) {
                        clearInterval(interval);
                        this.setState({});
                    }
                    return;
            }
            let a = arr[index];
            index++;
            fetch("https://api.scryfall.com/cards/search?q=" + a.substring(2)).then(response => {
                if (!response.ok) {
                    console.log(a.substring(2) + " not found");
                    return;
                }
                return response;
            }).then(data => (data? data.json() : null)).then(data => {
                if(data) {
                    let index = 0;
                    for(let card of data.data) {
                        if(card.name.trim() === a.substring(2).trim())
                        index = data.data.indexOf(card);
                    }
                    if(index == 0 && data.data[index].name.trim() !== a.substring(2).trim())
                    console.log(data.data[index].name, a.substring(2), data.data[index].name.trim() === a.substring(2).trim());
                    this.state.cards.push(data.data[index]);
                } else {
                    this.state.cards.push({ name: "Not Found", prices: {}, cmc: 0, image_uris: { png: "test.png" }, colors: [] });
                }
            });
        }, 10)});
    }

    render() {
        return (
            <div className="App">
                <div id="utilTest">
                    <Button id="btnTest" variant="contained" color="primary" onClick={() => {
                        window.open("https://store.tcgplayer.com/massentry?c="+text.replace(/\n/g, '||'));
                    }}>Buy</Button>
                    <Button id="btnTest" variant="contained" color="primary">Number of Cards: {this.state.cards.length}</Button>
                    <Button id="btnTest" variant="contained" color="primary" >Average CMC: {(() => {
                        let sum = 0;
                        let len = 0;
                        for(let card of this.state.cards) {
                            if(card.type_line && card.type_line.indexOf("Land") === -1) {
                                sum += card.cmc;
                                len++;
                            }
                        }
                        return Math.round(100*sum / len) / 100.0;
                    })()} </Button>
                    <Button id="btnTest" variant="contained" color="primary" >Total Cost: {(() => {
                        let sum = 0;
                        for(let card of this.state.cards) {
                            if(isNaN(parseFloat(card.prices.usd)))
                                console.log(card);
                            else
                                sum += parseFloat(card.prices.usd);
                        }
                        return Math.round(100*sum) / 100.0;
                    })()}</Button>
                    <Button id="btnTest" variant="contained" color="primary" >White: {(() => {
                        let total = 0;
                        for(let card of this.state.cards) {
                            if(card.colors.includes("W"))
                                total++;
                        }
                        return total;
                    })()}</Button>
                    <Button id="btnTest" variant="contained" color="primary" >Blue: {(() => {
                        let total = 0;
                        for(let card of this.state.cards) {
                            if(card.colors.includes("U"))
                                total++;
                        }
                        return total;
                    })()}</Button>
                    <Button id="btnTest" variant="contained" color="primary" >Black: {(() => {
                        let total = 0;
                        for(let card of this.state.cards) {
                            if(card.colors.includes("B"))
                                total++;
                        }
                        return total;
                    })()}</Button>
                    <Button id="btnTest" variant="contained" color="primary" >Red: {(() => {
                        let total = 0;
                        for(let card of this.state.cards) {
                            if(card.colors.includes("R"))
                                total++;
                        }
                        return total;
                    })()}</Button>
                    <Button id="btnTest" variant="contained" color="primary" >Green: {(() => {
                        let total = 0;
                        for(let card of this.state.cards) {
                            if(card.colors.includes("G"))
                                total++;
                        }
                        return total;
                    })()}</Button>
                    <Button id="btnTest" variant="contained" color="primary" onClick={this.switchFile}>File: {this.state.file}</Button> 
                    <Button id="btnTest" variant="contained" color="primary"><a href={"./cardlist" + this.state.file + ".txt"} download>Download</a></Button> 
                </div>
                <div id="cardsTest">
                    {this.state.cards.sort((a, b) => {
                        if(a.cmc === 0 && b.cmc === 0)
                            return 0;
                        else if(a.cmc === 0)
                            return 1;
                        else if(b.cmc === 0)
                            return -1;
                        return a.cmc - b.cmc
                    }).map((value, i) => (
                        <MtgCard key={i} {...value} />
                    ))}
                </div>
             </div>
        );
    }

}
