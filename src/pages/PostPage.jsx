import React from 'react'
import Base from "../components/Base" 
import { useParams } from 'react-router'
import { Button, Card, CardBody, CardText, Col, Container, Input, Row } from "reactstrap"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { createComment, loadPost } from "../services/post-service"
import { isLoggedIn } from "../components/auth/index"


import { toast } from 'react-toastify'
//import { BASE_URL } from "../services/helper"


const PostPage = () => {

    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState({
        conent: ''
    })

    useEffect(() => {
        // load post of postId 
        loadPost(postId).then(data => {
            console.log(data);
            setPost(data)

        }).catch(error => {
            console.log(error)
            toast.error("Error in loading post")
        })

    }, [])

    const printDate = (numbers) => {

        return new Date(numbers).toLocaleDateString()
    }

    const submitPost=()=>{

        if(!isLoggedIn()){
                toast.error("Need to login first !!")
                return
        }

        if(comment.content.trim()===''){
            return
        }
        createComment(comment,post.postId)
        .then(data=>{
            console.log(data)
            toast.success("comment added ..")
            setPost({
                ...post,
                comments:[...post.comments,data.data]
            })
            setComment({
                content:''
            })
        }).catch(error=>{
            console.log(error)
        })
    }

    return (

         <Base>
        <Container className="mt-4 ps-2 boarder-0">

         <Link to="/">Home</Link>  / {post && (<Link to="" >  {post.title} </Link>)}
            <Row>
               
               <Col md={{
                        size: 12
                    }}>

                       <Card className="mt-3">
                                              
                           {
                               (post) && (

                             <CardBody>
                                 {/*<CardText>Posted by <b>{post.user.name}</b></CardText>*/}
                                <CardText>Posted on <b> {printDate(post.addedDate)} </b>
                                 <h1>{post.title}</h1>                                
                                </CardText>

                                {/*<CardText>
                                    <span className="text-muted">{post.category.categoryTitle}</span>
                                </CardText>*/}
                                {/*<div className="image-container  mt-4 shadow  " style={{ maxWidth: '25%' }}>
                                            <img className="img-fluid" src={BASE_URL + '/post/image/' + post.imageName} alt="" />
                               </div>*/}

                             <CardText className="mt-5" dangerouslySetInnerHTML={{ __html: post.content }}>
                              </CardText>

                                
                             </CardBody>

                               )
                           }

                       </Card>
               
               </Col>

            </Row>

            <Row className="my-4">

                <Col md={

                  {
                     size: 9,
                     offset: 1
                 }
                 }>
               <h3>Post Comments</h3>
                       {
                  post && post.comments?.map((c, index)=> (
                    <Card className="mt-3 border-0" key={index}>
                    <CardBody>
                        <CardText>
                      {c.content}
                      </CardText>
                </CardBody>
            </Card>
                  ))
                  }

                           <Card className="mt-4 border-0" >
                            <CardBody>

                                <Input
                                    type="textarea"
                                    placeholder="Enter comment here"
                                    value={comment.content}
                                    onChange={(event) => setComment({content:event.target.value})}
                                    />

                             <Button  onClick={submitPost} className="mt-2" color="primary">Submit</Button>
                            </CardBody>
                        </Card>
            
        
               </Col>

            </Row>

            

        </Container>
        </Base>
        
    )
}


export default PostPage;
