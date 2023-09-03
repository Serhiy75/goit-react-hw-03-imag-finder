import { Component } from 'react';
import PropTypes from 'prop-types';
import { ImgGallery } from './ImageGallery.styled';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';

import { fetchImages } from '../../FetchApi/FetchApi';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import { ImageModal } from '../ImageModal/ImageModal';

export class ImageGallery extends Component {
  state = {
    images: [],
    query: '',
    loadMore: false,
    page: 1,
    error: null,
    isLoading: false,
    isModalOpen: false,
    dataModal: {
      image: '',
      alt: '',
    },
  };

  static getDerivedStateFromProps(props, state) {
    const { query } = props;
    if (query !== state.query) {
      return { page: 1, query, images: [] };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (prevProps.query !== this.props.query && this.props.query) ||
      prevState.page !== this.state.page
    ) {
      this.getSearchedImages();
    }
  }

  getSearchedImages = async () => {
    this.setState({ isLoading: true });
    try {
      const data = await fetchImages(this.props.query, this.state.page);
      this.setState(prev => ({ images: [...prev.images, ...data.hits] }));
      if (this.state.page * 12 < data.totalHits) {
        this.setState(() => ({ loadMore: true }));
      } else {
        this.setState(() => ({ loadMore: false }));
      }
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  changePage = () => {
    this.setState(prev => ({ page: prev.page + 1 }));
  };

  openModal = (image, alt) => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
      dataModal: { image, alt },
    }));
  };

  render() {
    const { images, isLoading, loadMore, isModalOpen, dataModal } = this.state;
    return (
      <>
        <ImgGallery className="gallery">
          {images.map(image => (
            <ImageGalleryItem
              key={image.id}
              image={image}
              openModal={this.openModal}
            />
          ))}
        </ImgGallery>
        {isLoading && <Loader />}
        {loadMore && <Button onClick={this.changePage} />}
        {isModalOpen && (
          <ImageModal image={dataModal} onClose={this.openModal} />
        )}
      </>
    );
  }
}

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};
