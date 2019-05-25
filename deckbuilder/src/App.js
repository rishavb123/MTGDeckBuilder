import React from 'react';
import { Button, TextField, MenuItem, Paper } from '@material-ui/core';

import './App.css';

class App extends React.Component {

    state = {
        value: "",
        suggestions: [],
    };

    render() {
        return (
            <div className="App">
                <div id="search-input">
                    <TextField id="Card Name" value={this.state.value} onChange={(e) => {
                        this.setState({ value: e.target.value, anchor: e.target});
                        fetch("https://api.scryfall.com/cards/autocomplete?q=" + e.target.value).then(response => {
                            if (!response.ok) {
                                throw Error('Network request failed.')
                            }
                            return response;
                        }).then(data => data.json()).then(data => {
                            this.setState({ suggestions: data.data });
                        });
                    }} style={{ width: "100%" }} />
                    {
                        this.state.suggestions.length > 0 ? (
                            <Paper style={{ maxHeight: 300, overflowY: "scroll" }} onClose={this.handleClose}>
                                {this.state.suggestions.map((value, i) => (
                                    <MenuItem key={i} onClick={() => {
                                        this.setState({ value: value, suggestions: [] });
                                    }}>{value}</MenuItem>
                                ))}
                            </Paper>
                        ) : null
                    }
                </div>
                <Button id="search" variant="contained" color="primary">
                    Search
                </Button>
             </div>
        );
    }

}

export default App;
