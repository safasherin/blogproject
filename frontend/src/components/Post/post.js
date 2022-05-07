import './Post.css';
import { Link } from 'react-router-dom';
import parse from "html-react-parser";

function Post({ post }) {

    return (
        <div className="post">
            {post.photo &&
                <img className="articleImg"
                    src={post.photo}
                    alt="imag"
                />}

            <div className="articleInfo">

                <Link to={`/post/${post._id}`} className="Linkpost">
                    <div className="title">{post.title}</div>
                </Link>

                <div className="desc">{parse(post.desc)}  </div>
                <div className="datetime">
                    <div className="date">{new Date(post.createdAt).toDateString()}</div>
                </div>
            </div>
            <hr />

        </div>
    )
}
export default Post;

