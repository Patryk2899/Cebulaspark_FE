import React, {useEffect, useRef, useState} from 'react';
import { PUBLIC_URL } from '../api/api-commons';
import '../styles/commentBox.css';
import axios from "axios";
import {toast} from "react-toastify";

interface User {
    id: number
    email: string
}

interface Comment {
    id: number;
    body: string;
    created_at: string;
    associated_user: User;
    bargain_id: number;
}

interface CommentBoxProps {
    comments: Comment[];
}

const CommentBox: React.FC<CommentBoxProps> = ({ comments }) => {
    const [newComment, setNewComment] = useState('');
    const commentsListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (commentsListRef.current) {
            commentsListRef.current.style.height = 'auto';
            const height = commentsListRef.current.clientHeight;
            commentsListRef.current.style.height = `${height}px`;
        }
    }, [comments]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newComment.trim() !== '') {
            axios.post(PUBLIC_URL + `${process.env.REACT_APP_COMMENTS_CREATE_URL}`, {
                body: newComment,
                bargain_id: comments[0].bargain_id
            }, {
                headers: {
                    'content-type': 'application/json',
                    accept: 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(response => {
                toast.success('Comment has been created')
            })
                .catch(err => {
                    console.log(localStorage.getItem('token'))
                    toast.error('Comment creation failed')
                })
        }
    };

    return (
        <div className="comment-box">
            <h2>Comments</h2>
            <div>
                {comments.map((comment) => (
                    <div className="comment">
                        <h4>{comment.associated_user.email}</h4>
                        <p>{comment.body}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="Write your comment..."
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CommentBox;