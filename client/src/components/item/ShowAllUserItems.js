import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegularBanner from '../banner/RegularBanner';
import axios from 'axios';
import star from '../../images/rating.png';
import { Card } from 'react-bootstrap';
import './Item.css';
import close from '../../images/close.png'

import { BrowserRouter as Route, Link } from 'react-router-dom';

class ShowAllUserItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      show: false
    }

    this.getBidVisibility = this.getBidVisibility.bind(this);
  }

  async componentDidMount() {
    var response = await axios.get('/items/getAllItemsForUser/' + this.props.match.params.email)
    console.log(response)
    this.setState({
      items: response.data,
      show: true
    })
  }

  getBidVisibility(item) {
    // no bid price means that bidding is not supported for this item
    if (!('bid_price' in item) || item.bid_price == null) {
      return 'item-bids-hide';
    } else {
      return 'item-bids-show';
    }
  }

  handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // TODO
     
    
      axios.post('/items/deleteItemForUser/' + id)
           .then(res => this.componentDidMount())
           .catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div>
        <RegularBanner />
        <div id="shown-items-div1" className="container list-container">
          <div id="shown-items-div2" className="items-row">
            { this.state.show ? 
            <div id="shown-items-div3">
              {this.state.items.length > 0 && (!this.props.auth.isAuthenticated || (this.props.auth.isAuthenticated && (this.props.auth.user.email !== this.props.match.params.email))) &&
                <div style={{marginBottom: "2rem"}}>
                  <span style={{fontWeight: "bold", fontSize: "1.3rem"}}>Products sold by {this.state.items[0].user_name}</span>
                  <Link to={"/showProfile/" + this.props.match.params.email} style={{color: "black"}}>
                    <button class="item-button" style={{fontSize: "1rem", float: "right"}}>See user profile</button>
                  </Link>
                </div>
              }
              { this.state.items.map(item =>
                <div>
                  {(this.props.auth.isAuthenticated && (this.props.auth.user.email === this.props.match.params.email)) && 
                    <img 
                      src={close} alt="close" 
                      className="service-close" 
                      style={{width: "20px", height: "20px", position: "relative", right: "25px", top: "20px"}}
                      onClick={() => this.handleDelete(item.item_id)}
                    />
                  }
                  <Link to={"/items/" + item.item_id}>
                    <div className="row shown-item-card">
                      <div className="col-12">
                        <div className="shown-item-text">
                          <span className="shown-item-name">Name:&nbsp;</span>
                          <span>{item.item_name}</span>
                        </div>
                        <div className="shown-item-text">
                          <span className="shown-item-description">Description:&nbsp;</span>
                          <span>{item.description}</span>
                        </div>
                        <div className="shown-item-text">
                          <span className="shown-item-category">Category:&nbsp;</span>
                          <span>{item.category}</span>
                        </div>
                        <div className="shown-item-text">
                          <span className="shown-item-price">Price:&nbsp;$</span>
                          <span>{item.price}</span>
                        </div>
                        <div className={"shown-item-text " + this.getBidVisibility(item)}>
                          <span className="shown-item-bid-price">Bid Price:&nbsp;$</span>
                          <span>{item.bid_price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            : null }
          </div>
        </div>  
      </div>
    )
  }
}



const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(mapStateToProps)(ShowAllUserItems) 