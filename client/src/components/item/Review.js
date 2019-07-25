import React, { Component } from 'react';
import './Item.css';
import LocationPicker from 'react-location-picker';
import apple from '../../images/apple.png'
import star from '../../images/rating.png'
import map from '../../images/map.jpg'
import axios from 'axios'
import  delete_icon  from './delete_icon.png'
import { connect } from 'react-redux'
import { Card } from 'react-bootstrap'
import Modal from 'react-modal';
import StarRatingComponent from 'react-star-rating-component';
import { toast } from 'react-toastify';

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width: "700px",
    height: "320px",
    backgroundColor: 'rgba(0,0,0,.6)'
   
  }
};

const reviews = [
  {
    user: 'John',
    img: apple,
    review: 'Apples are extremely rich in important antioxidants, flavanoids, and dietary fiber. The phytonutrients and antioxidants in apples may help reduce the risk of developing cancer, hypertension, diabetes, and heart disease.',
    date: '2 days ago',
    rating: [1, 2, 3, 4]
  },
  {
    user: 'Bob',
    img: apple,
    review: 'Apples are high in fiber and water — two qualities that make them filling.',
    date: '6 days ago',
    rating: [1, 2, 3]
  },
]

var defaultPosition

Modal.setAppElement("#root");

class Review extends Component {

  constructor(props) {
    super(props)
    this.state = {
   
      position: {
         lat: 37.7749,
         lng: -122.4194
      },
      showReviews: false,
      reply: '',
      comment: '',
      modalIsOpen: false,
      anonymous: false,
      rating: 5
    }
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

  submitComment = () => {
    var comment = this.state.comment;
    var item_id = this.props.item_id;
    var star_rating = this.state.rating;
    let data = null;
  
    if(!comment) {
      toast.error("ERROR: Please enter a review!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        newestOnTop: true,
        className: "addtocart-toast-toast",
        bodyClassName: "addtocart-toast-body",
        progressClassName: "addtocart-toast-progress",
        draggable: false,
      });
    } else {
      // always allow users to submit anonymous reviews
      if (this.state.anonymous) {
        data = {
          comment: comment,
          email: "Anonymous",
          star_rating: star_rating,
          name: "Anonymous"
        }
      } else {
        // if the user is not logged in, don't allow them to submit a non-anonymous review
        if(!this.props.auth || !this.props.auth.user || !this.props.auth.user.email) {
          toast.error("ERROR: You must be logged in to submit a named review! However, you can still choose to submit an anonymous review.", {
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
          data = {
            comment: comment,
            email: this.props.auth.user.email,
            star_rating: star_rating
          }
        }
      }
    }

    // only make the request if the data is set properly
    if(data) {
      axios
        .post('/items/postCommentForItem/' + item_id, data)
        .then(res => {
          console.log(res)
          window.location.reload()
        })
        .catch(err => console.log(err))
    }
  }


  toggleSubmitAsAnonymous= () => {
    this.setState({
      anonymous: !this.state.anonymous
    });
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
   
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  upvoteComment = (comment_id, email) => {
  
    var data = {
      email: email
    }
      axios.post('/items/upvote/' + comment_id, data)
      .then(res => {
        console.log(res)
        window.location.reload()
      })
    .catch(err => console.log(err))
  }

  undoUpvoteComment = (comment_id, email) => {
  
    var data = {
      email: email
    }
      axios.post('/items/undoUpvote/' + comment_id, data)
      .then(res => {
        console.log(res)
        window.location.reload()
      })
    .catch(err => console.log(err))
  }

  undoDownvoteComment = (comment_id, email) => {
  
    var data = {
      email: email
    }
      axios.post('/items/undoDownvote/' + comment_id, data)
      .then(res => {
        console.log(res)
        window.location.reload()
      })
    .catch(err => console.log(err))
  }

  downvoteComment = (comment_id, email) => {
  
    var data = {
      email: email
    }
      axios.post('/items/downvote/' + comment_id, data)
      .then(res => {
        console.log(res)
        window.location.reload()
      })
    .catch(err => console.log(err))
  }

  deleteComment = (comment_id) => {
     var data = {
      comment_id
     }
     axios.post('/items/deleteComment/' + this.props.item_id, data)
     .then(res => {
       console.log(res)
       window.location.reload()
     })
    .catch(err => console.log(err))
  }

  deleteReply = (comment_id, reply_id) => {
    var data = {
      reply_id: reply_id
    }
    axios.post('/items/deleteReply/' + comment_id, data)
      .then(res => {
        console.log(res)
        window.location.reload()
      })
     .catch(err => console.log(err))
  }

  replyComment = (comment_id, email) => {
   
    var data = {
      email: email,
      reply: this.state.reply
    }
     axios.post('/items/reply/' + comment_id, data)
        .then(res => {
          console.log(res)
          window.location.reload()
        })
        .catch(err => console.log(err))
        
  }

  async componentDidMount() {
    const response = await axios.get('/items/' + this.props.item_id)
    console.log(response.data[0].latitude)
    console.log(typeof(response.data[0].latitude))
    if (response.data[0]) {
      this.setState({
        item: response.data[0],
        position: {
          lat: response.data[0].longitude,
          lng: response.data[0].latitude
        },
        showReviews: true,
        comments: response.data[0].comments
      }) 
    }
  }

  render() {
    const { rating } = this.state;
    const defaultPosition = {
      lat: this.state.position.lat,
      lng: this.state.position.lng
    };
  
    return (
      <div class="container-review">
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          
          <textarea className="form-control" name = "comment" rows="8" id="comment"  onChange = {this.onChange}></textarea>
          <div>
          <div className="space">
                
                </div>   
       
        <StarRatingComponent 
          name="rate1" 
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        
        />
      </div>
          <div className="space">
                
                </div>
                <div className="field">
                
                </div>
                <button className="ui button" type="submit" onClick = {this.submitComment}>Submit</button>
                <span className="save_as_draft">
             
                     <div className="ui read-only checkbox">
                        <input type="checkbox" checked={this.state.anonymous} onChange={this.toggleSubmitAsAnonymous}/>
                        <label><b>Submit as an anonymous user</b></label>
                    </div>
                   
               </span>
                
                <div className="space">
                
                </div>
              
                
        </Modal>
      
          <div className = "itemReview">
          <Card.Header>
          <div className = "upper_review_comments">
            <button
              id="writeReviewBtn"
              type="button"
              onClick={this.openModal}
              className="btn btn-primary"
            >
              Write a review <i class="fas fa-pencil-alt"></i>
            </button>
          </div>
             {this.state.showReviews ?
             
             <div className = "review_comments">
               
               {this.state.comments.map(comment => 
                    <div className="container bootstrap snippet">
                    <div className="col-sm-12">
                      <div className="panel panel-white post panel-shadow">
                        <div className="post-heading">
                          <div className="pull-left image">

                          <img src={`/images/${comment.email}.jpg`} className="img-circle avatar" alt="user profile image" />
                         
                          </div>
                          <div className="pull-left meta">
                            <div className="title h5">
                            <a href="#"><b>{comment.name} </b></a>
                                        made a review.
                            </div>
                            <h6 className="text-muted time">{comment.time.substring(0,10) + ' ' + comment.time.substring(11,19)}</h6>
                          </div>

                          {comment.email === this.props.auth.user.email ?
                                                   <img src = {delete_icon} className = "profile_delete_icon" onClick = {() => this.deleteComment(comment.comment_id)} height="15" width="15"/>  
                                                    : null }
                        </div> 
                        <div className="post-description"> 
                          <p>{comment.comment}</p>
                      {comment.star_rating ?
                          <StarRatingComponent 
                              name="rate2" 
                              editing={false}
                              starCount={5}
                              value={comment.star_rating}
                       />
                       :  <StarRatingComponent 
                       name="rate2" 
                       editing={false}
                       starCount={5}
                       value={1}
                      /> }
                          <div className="stats">
                          { comment.upvote.some(element => element['email'] === this.props.auth.user.email) ?
                                <button onClick = {() => this.undoUpvoteComment(comment.comment_id, this.props.auth.user.email)} className="btn btn-default stat-item">
                                  <i className="fa fa-thumbs-up icon" id = "thumb_up_blue"/>{comment.upvote.length}
                                </button>
                                
                                : 
                                <button onClick = {() => this.upvoteComment(comment.comment_id, this.props.auth.user.email)} className="btn btn-default stat-item">
                                  <i className="fa fa-thumbs-up icon" />{comment.upvote.length}
                                </button> }

                          { comment.downvote.some(element => element['email'] === this.props.auth.user.email) ?
                                <button onClick = {() => this.undoDownvoteComment(comment.comment_id, this.props.auth.user.email)} className="btn btn-default stat-item">
                                  <i className="fas fa-thumbs-down icon" id = "thumb_up_blue"/>{comment.downvote.length}
                                </button>
                                : 

                                <button onClick = {() => this.downvoteComment(comment.comment_id, this.props.auth.user.email)} className="btn btn-default stat-item">
                                  <i className="fas fa-thumbs-down icon" />{comment.downvote.length}
                          </button> }



                          </div>
                        </div>
                        <div className="post-footer">
                          <div className="input-group"> 
                            <input className="form-control" placeholder="Add a comment" type="text" name = "reply" onChange = {this.onChange}/>
                            <span className="input-group-addon">
                              <button onClick = {() => this.replyComment(comment.comment_id, this.props.auth.user.email)}><i className="fa fa-edit" /></button>  
                            </span>
                          </div>
                          <ul className="comments-list">

                            {comment.replies.map(reply =>
                                    <li className="comment">
                                      <a className="pull-left" href="#">
                                      <img src={`/images/${reply.email}.jpg`} className="img-circle avatar" alt="img" />
                                      </a>
                                      <div className="comment-body">
                                        <div className="comment-heading">
                                          <h4 className="user">{reply.name}</h4>
                                          <h5 className="time">{reply.time.substring(0,10) + ' ' + reply.time.substring(11,19)}</h5>
                                          {reply.email === this.props.auth.user.email ?
                                                          <img src = {delete_icon} className = "profile_delete_icon"  height="15" width="15" onClick = {() => this.deleteReply(comment.comment_id, reply.reply_id)}/>  
                                                           : null }
                                        </div>
                                        <p>{reply.reply}</p>
                                      </div>
                                    
                                    </li>
                            )}
                            
                          </ul>
                        </div>
                      </div>
                    </div>


                    <div className = "space">
                                  </div>

                  </div>
                  
               )}
                  </div>
                  : null }
                   </Card.Header>
              </div>
              
      <div className = "eachItemMap">
              <LocationPicker
                                
                                    containerElement={ <div style={ {height: '100%'} } /> }
                                    mapElement={ <div style={ {height: '400px'} } /> }
                                    defaultPosition={defaultPosition}
                                    onChange={this.handleLocationChange}
                                    zoom = {14}
                                />
                                </div>
        
      
        <div class="row" style={{marginTop: "1rem"}}>
          
          
        
           
              {/* <LocationPicker
                                    containerElement={ <div style={ {height: '100%'} } /> }
                                    mapElement={ <div style={ {height: '400px'} } /> }
                                    defaultPosition={defaultPosition}
                                    onChange={this.handleLocationChange}
                                    zoom = {14}
                                /> */}
                                
         
         
          <div class="col-7">
            <ul class="item-review-list">
              {reviews.map(review => {
                return (
                  <li key={review.user} class="item-review-item row">
                    <div class="col-3">
                      <img class="item-recommendation-img" style={{width: "100%"}} src={review.img} alt="Item"></img>
                      <div class="item-recommendation-title">{review.user}</div>
                    </div>
                    <div class="col-6">
                      <div>{review.review}</div>
                      <div>
                        {review.rating.map(i => {
                          return <img key={i} class="item-rating" src={star} alt="Rating" style={{width: "16px", height: "16px"}}></img>
                        })}
                      </div>
                      <div style={{marginTop: "1rem", color: "#888888"}}>{review.date}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps)(Review)