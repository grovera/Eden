import React, { Component } from 'react';
import './Cart.css';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class SimilarItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recs: []
    };
  }

  componentWillMount() {
    // show top items
    axios
      .get('/recs/getTopRatedItems')
      .then(res => {
        console.log(res);
        this.setState({
          recs: res.data
        })
      })
      .catch(err =>
        console.log(err)
      );
  }

  render() {
    return (
      <div id="top-rated-items-1">
        <h3 id="top-rated-items-h3">Top Rated Items</h3>
        <div class="top-rated-items-2">
          {this.state.recs.slice(0,25).map(rec => {
            return (
              <div key={rec.id} class="top-rated-items-3">
                <div>
                  <img class="top-rated-items-img" style={{width: "100%"}} src={rec.image} alt="Item"></img>
                </div>
                <div>
                  <Link to={"/items/" + rec.id}>
                    <span class="top-rated-items-title" onClick={() => window.scrollTo(0, 0)}>{rec.name}</span>
                  </Link>
                  <div>{rec.price}</div>
                  <div>{rec.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    cart: state.cart
  }
};

export default connect(
  mapStateToProps
)(SimilarItems);













