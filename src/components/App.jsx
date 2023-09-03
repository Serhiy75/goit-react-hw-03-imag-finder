import { Component } from 'react';
import { AppDiv } from './App.styled';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';

export class App extends Component {
  state = {
    query: '',
  };

  setQuery = query => {
    this.setState({ query });
    // console.log(query);
  };

  render() {
    return (
      <AppDiv>
        <Searchbar setQuery={this.setQuery} />
        <ImageGallery query={this.state.query} />
      </AppDiv>
    );
  }
}
