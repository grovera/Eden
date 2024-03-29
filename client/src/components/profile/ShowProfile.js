import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RegularBanner from '../banner/RegularBanner';
import { connect } from 'react-redux';
import './ShowProfile.css';
import { Card } from 'react-bootstrap';
import  delete_icon  from './delete_icon.png';
import  loading_icon  from './loading.gif';
import  isUrl  from 'is-valid-http-url';
import MicrolinkCard from '@microlink/react';
import request from 'request-promise';
import isReachable from 'is-reachable';
import Modal from 'react-modal';
import ChangeProfile from './ChangeProfile';
import default_profile_image from './default.png';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import InfiniteScroll from 'react-infinite-scroller';

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "420px",
    height: "420px",
    backgroundColor: "rgb(32,32,32)"
  }
};

const customStyles2 = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "600px",
    height: "190px",
    backgroundColor: "rgb(32,32,32)"
  }
};


const edit_profile_customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "650px",
    height: "500px",
    backgroundColor: 'rgba(0,0,0,.6)'
  }
};

Modal.setAppElement("#root");

class ShowProfile extends Component {
  constructor() {
    super()
    this.state = {
      image_path: '',
      first_name: '',
      last_name: '',
      DOB: '',
      gender: '',
      email: '',
      phone_number: '',
      address: '',
      country: '',
      company: '',
      about_me: '',
      showProfile: false,
      loadPosts: false,
      share_post: '',
      post_id: '',
      posts: [],
      scroll_posts: [],
      hasMore: true,
      comment: '',
      modalIsOpen: false,
      permissionModalIsOpen: false,
      profileModalIsOpen: false,
      post_like: [],
      anonymous: false
    }
    this.post_array = []
    this.total_posts = null
  }

  defaultImage = (e) => {
    e.target.src = `/images/default.png`
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleClick = () => {
    var post = this.state.share_post;

    var profile_owner_email = this.props.match.params.email;
    var isAnonymous
    var name = this.props.auth.user.name;
    var email = this.props.auth.user.email;
    if (!this.state.anonymous) {
    
      isAnonymous = false

    } else {
      // name = "Anonymous";
      // email = "Anonymous";
      isAnonymous = true
    }

    var data = {
      post,
      name,
      email,
      profile_owner_email,
      isAnonymous
    };
    console.log(data)

     axios
      .post('/profile/sharePost', data)
      .then(res => {
        console.log(res);
        this.componentDidMount();
      
      
        this.setState({share_post: ''});
      })
      .catch(err => console.log(err))
  }

  handleComment = (post_id) => {
    var comment = this.state.comment;
    var email = this.props.auth.user.email;
    var profile_owner_email = this.props.match.params.email;
    var name = this.props.auth.user.name;
    var data = {
      comment,
      email,
      profile_owner_email,
      name,
      post_id
    };

    axios
      .post('/profile/commentPost', data)
      .then(res => {
        console.log(res);
       
       this.componentDidMount();
   
      
        this.setState({
          comment: ''
        });
         
      })
      .catch(err => console.log(err))
  }

  likePost = (post_id) => {
    var name = this.props.auth.user.name;
    var email = this.props.auth.user.email;
    var profile_owner_email = this.props.match.params.email;
    var data = {
      post_id,
      name,
      email,
      profile_owner_email
    };

    axios
      .post('/profile/likePost', data)
      .then(res => {
        console.log(res);
        this.componentDidMount();
    
       
      })
      .catch(err => console.log(err))
  }
  
  deletePost = (post_id) => {
    var profile_owner_email = this.props.match.params.email;
    var data = {
      profile_owner_email,
      post_id
    };

    axios
      .post('/profile/deletePost', data)
      .then(res => {
        console.log(res);
        this.componentDidMount();
        this.setState({
          permissionModalIsOpen: false
        })
      
       
      })
      .catch(err => console.log(err))
  }

  deleteComment = (comment_id, post_id) => {
    var email = this.props.auth.user.email;
    var profile_owner_email = this.props.match.params.email;
    var data = {
      comment_id,
      email,
      profile_owner_email,
      post_id
    };

    axios
      .post('/profile/deleteCommentPost', data)
      .then(res => {
        console.log(res);
        this.componentDidMount();

      
      })
      .catch(err => console.log(err))
  }

  toggleAnonymous = () => {
    this.setState({
      anonymous: !this.state.anonymous,
    });
  }

  unlikePost = (post_id) => {
    var email = this.props.auth.user.email;
    var profile_owner_email = this.props.match.params.email;
    var data = {
        post_id,
        email,
        profile_owner_email
    };

    axios
      .post('/profile/unlikePost', data)
      .then(res => {
        console.log(res);
        this.componentDidMount();
    
     
      })
      .catch(err => console.log(err))
  }

  handleURL = async(url) => {
    console.log(url);
    var result = await isReachable(url);
    console.log(result);
    return result;     
  }

  openModal = (post_like) => {
    this.setState({
      modalIsOpen: true,
      post_like: post_like
    });
  }

  openPermissionModal = (post_id) => {
    this.setState({
      permissionModalIsOpen: true,
      post_id: post_id
    });
  }

  cancelPermissionModal = () => {
    this.setState({permissionModalIsOpen: false});
  }

  closePermissionModal = () => {
    this.setState({permissionModalIsOpen: false});
  }

 
  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }
 
  closeModal = () => {
    this.setState({modalIsOpen: false});
  }


  profileOpenModal = () => {
    this.setState({profileModalIsOpen: true});
  }

  profileAfterOpenModal = () => {
    //references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  profileCloseModal = () => {
    this.setState({profileModalIsOpen: false});
  }

  loadFunc = async () => {
    console.log("loadFunc")
    
    var temp_posts = await this.state.posts.slice(this.state.scroll_posts.length, this.state.scroll_posts.length + 2)
    if (this.total_posts) {
        
          if (this.state.scroll_posts.length < this.total_posts) {
            
          
              console.log("succesfully lazy load")
            
          
            this.setState({
              scroll_posts: [...this.state.scroll_posts.concat(temp_posts)],
              hasMore: true,
              loadPosts: true
            
            })
            

          } else {
            console.log(this.state.scroll_posts.length)
            console.log(this.total_posts)
            this.setState({
            hasMore: false
            
            })
          }
    }
    
      
  }

  async componentDidMount() {
    const response = await axios.get('/profile/' + this.props.match.params.email);
   
    if (response.data[0]) {
      this.total_posts = response.data[0].posts.length
      if (response.data[0].profile_picture_path && response.data[0].email) {
       
        this.setState({
          image_path: response.data[0].profile_picture_path,
          first_name: response.data[0].first_name,
          last_name: response.data[0].last_name,
          DOB: response.data[0].DOB,
          gender: response.data[0].gender,
          email: response.data[0].email,
          phone_number: response.data[0].phone_number,
          address: response.data[0].address,
          country: response.data[0].country,
          company: response.data[0].company,
          about_me: response.data[0].about_me,
          posts: response.data[0].posts.reverse(),
          showProfile: true
          
        });
       
      
      } 
     
      if (!response.data[0].profile_picture_path && response.data[0].email) {
        this.setState({
          showProfile: false,
          posts: response.data[0].posts
        });
        this.post_array =  response.data[0].posts
      }
      var temp_array = []
      console.log(this.state.posts)
      if (this.state.posts.length > 0) {
            // for (var i = 0; i < 2; i++) {
              
            //   temp_array.push(this.state.posts[i])
            // }
            temp_array = this.state.posts.slice(0, 2)

            this.setState({
              scroll_posts: temp_array,
              loadPosts: true
             
            })
         

          } else {
            this.setState({
              scroll_posts: [],
              loadPosts: false
      
            })
          }
    
    } 
    this.loadFunc()
  }

  render() {
    const { errors } = this.state
    return (
      <div>
        <RegularBanner />
        <div className="ShowProfileContainer">
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div style={{height: '320px', width: '375px', border: '1px solid #ccc', font: '16px/26px Georgia, Garamond, Serif', overflow: 'auto'}}>
              {this.state.post_like.map(like => 
                <div>
                  <img className="profile_picutures_like" src={`/images/${like.email}.jpg`} height="80" width="120" />
                    { }<span style = {{color: "white"}}>{like.name} </span>
                    <div className="space">
                    </div>
                </div>
              )}
            </div>
            <button className="ui primary button profile_picutures_like_button" onClick={this.closeModal}>Close</button>
          </Modal>

          <Modal
          isOpen={this.state.permissionModalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closePermissionModal}
          style={customStyles2}
          contentLabel="Example Modal"
        >
          <h3 style = {{color: "white"}}>Are you sure you want to delete this post? </h3>
          <div style = {{textAlign: "center", marginTop: "50px"}}>
            <button type="button" className="btn btn-danger" onClick = {() => this.deletePost(this.state.post_id)} style = {{marginRight: "40px", height: "40px", width: "100px"}}>Delete</button>
            <button type="button" className="btn btn-primary" onClick = {this.cancelPermissionModal} style = {{height: "40px", width: "100px"}}>Cancel</button>
          </div>
        </Modal>

          <Modal
            isOpen={this.state.profileModalIsOpen}
            onAfterOpen={this.profileAfterOpenModal}
            onRequestClose={this.profileCloseModal}
            style={edit_profile_customStyles}
            contentLabel="Example Modal"
          >
            <ChangeProfile />
          </Modal>
          {this.state.showProfile ? 
            <div style ={{width: "340px"}}>
              <Card.Header>
                <img src={this.state.image_path} height="250" width="300" />
                {this.props.auth.user.email == this.props.match.params.email ?
                <h4 onClick={this.profileOpenModal} className="edit_profile_h4"> <i class="fas fa-user"></i> Edit Profile </h4> 
                :  null }
                <div className="">
                  <div>First Name: {this.state.first_name}</div>
                  <div>Last Name: {this.state.last_name}</div>
                  <div>Date of Birth: {this.state.DOB}</div>
                  <div>Gender: {this.state.gender}</div>
                  <div>Email: {this.state.email}</div>
                  <div>Phone Number: {this.state.phone_number}</div>
                  <div>Country: {this.state.country}</div>
                  <div>Company: {this.state.company}</div>
                  <div>About Me: {this.state.about_me}</div>
                  <MessengerCustomerChat
                    pageId="2292649427730564"
                    appId="466650420800999"
                    htmlRef={window.location.pathname}
                  />
                </div>
              </Card.Header> 
            </div>
            : 
            <div style={{width: "340px"}}>
              <Card>
                <img src = {default_profile_image } height = "250" width = "300" />
                {(this.props.auth.user.email === this.props.match.params.email) &&
                  <h4 onClick = {this.profileOpenModal} className = "edit_profile_h4"> <i class="fas fa-user"></i> Edit Profile </h4> 
                }       
              </Card> 
              {(this.props.auth.user.email !== this.props.match.params.email) &&
                <div>
                  <div>
                    <Link to={"/showShowAllUserItems/" + this.props.match.params.email} style={{color: "black"}}>
                      <button class="item-button" style={{marginLeft: "auto", marginRight: "auto", marginTop: "1.5rem", fontSize: "1.2rem", width: "100px"}}>Products</button>
                    </Link>
                  </div>
                  {this.props.auth.isAuthenticated &&
                    <div>
                      <Link to={{pathname: "/inbox/" + this.props.auth.user.email + "/0", state: {email: this.props.match.params.email}}} style={{color: "black"}}>
                        <button class="item-button" style={{marginLeft: "auto", marginRight: "auto", marginTop: "0.5rem", fontSize: "1.2rem", width: "100px"}}>Contact</button>
                      </Link>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <div className = "ShowProfileWallContainer">
          <MessengerCustomerChat
            pageId="2292649427730564"
            appId="466650420800999"
          />
          {this.props.auth.user.email ?
          <Card>
            <div class="non-semantic-protector"> 
              <h1 class="ribbon">
                <strong className="">Share something today!</strong>
              </h1>
            </div>
            <div class="profile_space1">
            </div>
            <div class="profile_space2">
            </div>
            <div class="ui form">
              <div class="field">     
                <textarea  name="share_post" value = {this.state.share_post} onChange = {this.onChange}></textarea>
              </div>
            </div>
            <div>
              <div className="anonymous"> 
                <div class="ui checkbox">
                  <input type="checkbox" name="example" checked={this.state.anonymous} onChange={this.toggleAnonymous}/>
                  <label class="anonymous-label">Share post anonymously</label>
                </div>
              </div>
              <button type="button" className="share_button" onClick={this.handleClick}>Share</button>
            </div>      
          </Card> 
          : null }
          <div className="showPosts">
            <div className="space">
            </div>
            <Card>
            {this.state.loadPosts ? 
              <div>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadFunc}
                  hasMore={this.state.hasMore}
                  loader={<div className="loader" key={0}>
                 
                 <img style = {{height: "100px", marginLeft: "280px"}} src = {loading_icon} />
    
             </div>}
>
              {this.state.scroll_posts.map(post =>
                <div className="container bootstrap snippet">
                  <div className="col-sm-12">
                    <div className="panel panel-white post panel-shadow">
                      <div className="post-heading">
                        <div className="pull-left image">
                          {!post.isAnonymous ?
                          <img src={`/images/${post.email}.jpg`} className="img-circle avatar" alt="user profile image" onError={this.defaultImage}/>
                          : 
                          <img src={`/images/Anonymous.jpg`} className="img-circle avatar" alt="user profile image" onError={this.defaultImage}/> }
                        </div>
                        <div className="pull-left meta">
                          <div className="title h5">
                          {!post.isAnonymous ?
                            <a href="#"><b>{post.name} </b></a>
                            : 
                          <a href="#"><b>Anonymous </b></a> }
                                      made a post. 
                          </div>
                          <h6 className="text-muted time">{post.time.substring(0,10) + ' ' + post.time.substring(11,19)}</h6>
                        </div>
                          {post.email === this.props.auth.user.email ?
                                         <img src = {delete_icon} className = "profile_delete_icon" onClick = {() => this.openPermissionModal(post.post_id)} height="15" width="15"/>  
                                          : null }
                      </div> 
                      <div className="post-description"> 
                        <div>
                          {post.post.split("\n").map((i,key) => {
                            return <div key={key}>{i}</div>;
                          })}
                        </div>
                        {isUrl(post.post) ? 
                          <div>
                            {isReachable(post.post) ?
                              <div>
                                <MicrolinkCard url={post.post}  />
                              </div>
                              : null
                            }
                          </div>
                          : null
                        }
                        <div className="stats">
                        { post.like.some(element => element['email'] === this.props.auth.user.email) ?
                          <div>
                            <button href="#" className="btn btn-default stat-item" onClick={() => this.unlikePost(post.post_id)}>
                              <i className="fa fa-thumbs-up icon" id = "thumb_up_blue"/>
                            </button>
                            <button href="#" className="btn btn-default stat-item" onClick={() => this.openModal(post.like)}>
                               {post.like.length}
                            </button>
                          </div>
                          : 
                          <div>
                            <button href="#" className="btn btn-default stat-item" onClick = {() => this.likePost(post.post_id)}>
                              <i className="fa fa-thumbs-up icon"  />
                            </button>
                            <button href="#" className="btn btn-default stat-item" onClick={() => this.openModal(post.like)}>
                              {post.like.length}
                            </button>
                          </div>
                        }
                        </div>
                      </div>
                      <div className="post-footer">
                        <div className="input-group"> 
                          <input className="form-control" name = "comment"  id="comment" value = {this.state.comment} placeholder="Add a comment" type="text" onChange = {this.onChange}/>
                          <span className="input-group-addon">
                            <button href="#" onClick = {() => this.handleComment(post.post_id)}><i className="fa fa-edit" /></button>  
                          </span>
                        </div>
                        {post.comments.map(comment => 
                          <ul className="comments-list">
                            <li className="comment">
                              <a className="pull-left" href="#">
                                <img src={`/images/${comment.email}.jpg`} className="img-circle avatar" alt="user profile image" onError={this.defaultImage}/>
                              </a>
                              <div className="comment-body">
                                <div className="comment-heading">
                                  <h4 className="user">{comment.name}</h4>
                                  <h5 className="time">{comment.time.substring(0,10) + ' ' + comment.time.substring(11,19)}</h5>
                                  {comment.email === this.props.auth.user.email ?
                                    <img src = {delete_icon} className = "profile_delete_icon" onClick = {() => this.deleteComment(comment.comment_id, post.post_id)} height="15" width="15"/>  
                                      : null }
                                </div>
                                <p>{comment.comment}</p>
                              </div>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className = "space">
                  </div>
                </div>       
                )}
                </InfiniteScroll>
              </div>
              :
               null
              }
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps)(ShowProfile)