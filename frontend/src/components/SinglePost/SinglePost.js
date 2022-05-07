import { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import './SinglePost.css';
import parse from "html-react-parser";
import { Context } from "../../context/Context";
import axios from 'axios';

function SinglePost() {
    const location = useLocation();
    const path = (location.pathname.split('/')[2]);
    const { user, jsonwebtoken } = useContext(Context);
    const [post, setPost] = useState({});
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [state, setState] = useState("initial");
    const [updateMode, setUpdateMode] = useState(false);
    // const descValue = parse(desc);
    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await axios.get("/posts/" + path);
                setPost(res.data);
                setTitle(res.data.title);
                setDesc(parse(res.data.desc));
            } catch (err) { }
        }
        getPost();

    }, [path]);

    const handleDelete = async () => {

        try {

            await axios.delete("/posts/" + path,
                {
                    data: { username: user.username },
                    headers: { Authorization: `Bearer ${jsonwebtoken}` }
                });
            window.location.replace("/");
        } catch (err) {
            console.log("error")
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setState("sending")
            await axios.put("/posts/" + path, { username: user.username, title, desc },
                {
                    headers: { Authorization: `Bearer ${jsonwebtoken}` }
                });
            setUpdateMode(false);
            setState("success");
            e.target.reset();
        } catch (err) {
            setState("unSuccess")
        }
    }
    return (
        <div className="singlePost">
            <div className="singleArti">
                {post.photo && (
                    <img src={post.photo}
                        alt="img" className="singleArtiImg" />
                )}

                {updateMode ? (<input type="text" value={title} className="singleArtiTitleInput"
                    onChange={(e) => setTitle(e.target.value)}
                />) : (
                    <h1 className="singleArtiTitle">{title}
                        {(post.username === user?.username) && (
                            <div className="singleArtiEdit">
                                <span className="singleArtiIcon" onClick={() => {
                                    setUpdateMode(true)

                                }}><FiEdit /></span>
                                <span className="singleArtiIcon" onClick={handleDelete}><MdDelete /></span>

                            </div>
                        )}
                    </h1>
                )}

                <p className="singleArtiAuthor">Author :
                    <Link to={`/?user=${post.username}`} className="Linkpost"><b> {post.username}</b></Link>
                </p>
                {/* console.log({desc}) */}
                {updateMode ? (<input type="text" value={desc}
                    className="singleArtiDescInput"
                    onChange={(e) => setDesc(e.target.value)
                    } />
                ) : (
                    post.desc && (<p className="singleArtiDesc">{desc}

                    </p>
                    )

                )}

                <div className="singleArtiDT">

                    <span className="singleArtiDate">{new Date(post.createdAt).toDateString()}</span>
                    <br />
                    {updateMode &&
                        (
                            <div className="singlePstbtnDiv">

                                {state !== "sending" && state !== "success" &&

                                    <button className="singlePostButton" onClick={handleSubmit}>Update</button>}

                            </div>

                        )}
                    {
                        state === "sending" &&
                        <div className="singlePstbtnDivLoading">
                            <p className="loadingP">Loading...</p>
                        </div>
                    }
                </div>
            </div>

        </div>

    )
}

export default SinglePost;
