import React, { Component } from 'react';
import { connect } from 'react-redux'
import RegularBanner from '../banner/RegularBanner'
import axios from 'axios'
import LocationPicker from 'react-location-picker';
import uuidv4 from 'uuid/v4';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { toast } from 'react-toastify';
import './Item.css';

class CreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_name: '',
      item_image: null,
      ar_file: null,
      vr_file: null,
      vr_file_name: '',
      category: '',
      description: '',
      price: '',
      bid_price: '',
      address: "",
      position: {
        lat: 37.7749,
        lng: -122.4194
      },
      errors: {
        item_name: false,
        item_image: false,
        ar_file: false,
        vr_file: false,
        vr_file_name: false,
        category: false,
        description: false,
        price: false,
        bid_price: false,
        address: false,
        position: false
      },
    }
  }

  handleChange = address => {
    this.setState({ address });
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {    
        this.setState({
          position: latLng
        })
        console.log('Success', this.state.position)
      })
      .catch(error => console.error('Error', error));
  }

  handleLocationChange = ({ position, address }) => {
    // Set new location
    this.setState({ position, address });
  }

  handleImage = event => {
    console.log('uploaded')
    let item_image = event.target.files[0]
    this.setState({item_image: item_image})
  }

  handleVRFile = event => {
    console.log('uploaded')
    let vr_file = event.target.files[0]
    this.setState({vr_file: vr_file})
  }

  handleARFile = event => {
    console.log('uploaded')
    let ar_file = event.target.files[0]
    this.setState({ar_file: ar_file})
  }

  onChange = (e) => {
    this.setState({[e.target.name]:e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();

    // form validation
    let emptyFields = []

    if(!this.state.item_name) {
      emptyFields.push('item name');
    }

    if(this.state.vr_file && !this.state.vr_file_name) {
      emptyFields.push('VR file name');
    }

    if(!this.state.category) {
      emptyFields.push('category');
    }

    if(!this.state.description) {
      emptyFields.push('description');
    }

    if(!this.state.price) {
      emptyFields.push('price');
    }

    if(!this.state.address) {
      emptyFields.push('location');
    }

    // if we're missing a required field, show
    // error message and prompt user
    if(emptyFields.length > 0) {
      let s = emptyFields[0]
      if(emptyFields.length > 1) {
        let a = emptyFields.slice(1);
        for(let i=0; i<a.length; i++) {
          s += ', ' + a[i];
        }
      }

      let msg = 'Error: you must provide the following required field(s): ' + s;

      toast.error(msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        newestOnTop: true,
        className: "addtocart-toast-toast",
        bodyClassName: "addtocart-toast-body",
        progressClassName: "addtocart-toast-progress",
        draggable: false,
      });
    } else {
      var item_id = uuidv4();
      let item_image = this.state.item_image;
      let vr_file = this.state.vr_file;
      let ar_file = this.state.ar_file;

      let formdata = new FormData();

      formdata.append('item_id', item_id);
      formdata.append('email', this.props.auth.user.email);
      formdata.append('user_name', this.props.auth.user.name);
      formdata.append('item_name', this.state.item_name);
      formdata.append('filename', item_image);
      formdata.append('ar_file', ar_file);
      formdata.append('filename', vr_file);
      formdata.append('vr_file_name', this.state.vr_file_name);
      formdata.append('category', this.state.category);
      formdata.append('description', this.state.description);
      formdata.append('price', this.state.price);
      formdata.append('bid_price', this.state.bid_price);
      formdata.append('address', this.state.address);
      formdata.append('longitude', this.state.position.lat);
      formdata.append('latitude', this.state.position.lng);

      
      if (ar_file) {
        formdata.append('ar', ar_file.name)
      }
    
      console.log("address is " + this.state.address);

      axios
        .post('/items/createItem', formdata)
        .then(res => 
          {
            console.log("item created");
            console.log(res);
            window.location.reload();

            let msg = "New item successfully created!";
            
            toast.success(msg, {
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              newestOnTop: true,
              className: "addtocart-toast-toast",
              bodyClassName: "addtocart-toast-body",
              progressClassName: "addtocart-toast-progress",
              draggable: false,
            });
          })
        .catch(err => console.log(err));
    }
  }

  render() {
    const defaultPosition = {
      lat: this.state.position.lat,
      lng: this.state.position.lng
    };

    const { errors } = this.state;

    return (
      <div>
        <RegularBanner />
        <div className = "createItem" >
          <h1>Create an item for sale</h1>
          <form onSubmit = {this.onSubmit} className="ui form">

            <div className="field">
              <label>Item Name <span className="required-asterisk">*</span></label>
              <input type="text" name="item_name" placeholder="Item Name"  onChange = {this.onChange}/>
            </div>

            <div className = "inputError">
              {errors.item_Name }
            </div>

            <div className="field">
              <label> Upload an image </label>
              <input type="file" name="filename" className="fileToUpload"  onChange = {this.handleImage}/>
            </div>

            <div className="field">
              <label> Upload an AR file </label>
              <input type="file" name="ar_file" className="fileToUpload"  onChange = {this.handleARFile}/>
            </div>

            <div className="field">
              <label> Upload a VR file (zip format) </label>
              <input type="file" name="filename" className="fileToUpload"  onChange = {this.handleVRFile}/>
            </div>

            <div className="field">
              <label>VR File Name</label>
              <input type="text" name="vr_file_name" placeholder="VR File Name"  onChange = {this.onChange}/>
            </div>

            <div className = "inputError">
              {errors.vr_file_name }
            </div>  
                
            <div className="field">
              <label>Category <span className="required-asterisk">*</span></label>
              <select name="category" id="category-select" onChange={this.onChange}>
                <option disabled selected value> -- select a category -- </option>
                <option value="appliances">Appliances</option>
                <option value="arts">Arts</option>
                <option value="books">Books</option>
                <option value="clothing">Clothing</option>
                <option value="computers">Computers</option>
                <option value="electronics">Electronics</option>
                <option value="games">Games</option>
                <option value="home">Home</option>
              </select>
            </div>

            <div className = "inputError">
              {errors.category }
            </div> 
                
            <div className="field">
              <label>Description <span className="required-asterisk">*</span></label>
              <textarea name="description" placeholder="Description" rows="5" onChange = {this.onChange}/>
            </div>

            <div className = "inputError">
              {errors.description }
            </div> 

            <div className="field">
              <label>Price <span className="required-asterisk">*</span></label>
              <input type="text" name="price" placeholder="Price"  onChange = {this.onChange}/>
            </div>

            <div className = "inputError">
              {errors.price }
            </div> 

            <div className="field">
              <label>Starting Bid Price</label>
              <input type="text" name="bid_price" placeholder="Starting Bid Price"  onChange = {this.onChange}/>
            </div>

            <div className = "inputError">
              {errors.bid_price }
            </div> 

            
            <div className="field">
              <label>Location <span className="required-asterisk">*</span></label>
            </div>

            <PlacesAutocomplete
              value={this.state.address}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    type="text" 
                    name="address"
                    {...getInputProps({
                        placeholder: 'Search Places ...',
                        className: 'location-search-input',
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? 'suggestion-item--active'
                          : 'suggestion-item';
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                          : { backgroundColor: '#ffffff', cursor: 'pointer' };
                        return (
                          <div
                              {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                              })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>

            <div className="field">
            </div>

            <div>
              <h1>{this.state.address}</h1>
              <div>
                <LocationPicker
                  containerElement={ <div style={ {height: '100%'} } /> }
                  mapElement={ <div style={ {height: '400px'} } /> }
                  defaultPosition={defaultPosition}
                  onChange={this.handleLocationChange}
                  zoom = {14}
                />
              </div>
            </div>

            <div className="space">
            </div>
               
            <button
                className="ui button"
                type="submit"
                >Submit
            </button>
            
            <div className="space">
            </div>
                        
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(mapStateToProps)(CreateItem) 