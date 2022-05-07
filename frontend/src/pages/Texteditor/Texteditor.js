import React, { useContext, useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import parse from "html-react-parser";
import './Texteditor.css';
import { Context } from '../../context/Context.js';
import axios from "axios";
import { BsFillImageFill } from "react-icons/bs";

function Texteditor() {
    const [file, setFile] = useState("");
    const [desc, setDesc] = useState("");
    const [state, setState] = useState("initial")
    const { user, jsonwebtoken } = useContext(Context);
    let titleField;



    const formData = new FormData();


    const uploadFile = (e) => {
        setFile(e.target.files[0])

    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setState("sending")
        // setDesc(parse(firstDesc))
        formData.append('title', titleField.value);
        formData.append('desc', desc);
        formData.append('author', user.username);
        formData.append('photo', file);
        formData.append('username', user.username);





        try {
            const res = await axios.post('/posts/add', formData, {
                headers: { Authorization: `Bearer ${jsonwebtoken}` }
            });
            setState("success");
            window.location.replace("/post/" + res.data._id);

        } catch (err) {

        }
    }


    return (
        // <div className="Texteditor">
        <form onSubmit={handleSubmit} className="Texteditor">
            {file ? (
                <div className="">
                    <img htmlFor="fileInput" className="displayImg" src={URL.createObjectURL(file)} alt="img1" />
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={uploadFile}

                    />
                </div>
            )
                :


                <div className="fileInput">
                    <label htmlFor="fileInput" >
                        {/* <i className="writeIcon fas fa-plus"></i> */}
                        <span >
                            <BsFillImageFill className="writeIcon" />
                        </span>
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={uploadFile}

                    />
                </div>
            }

            <div className="title">

                <label
                    style={{ "fontWeight": "600" }}
                >Title : </label>
                <input type="text" className="titlefield"

                    ref={(elem) => { titleField = elem }}
                // onChange={e => setTitle(e.target.value)} 
                />
                <br />
            </div>




            <div className="descEditor">
                <div className="editor">
                    <CKEditor
                        editor={ClassicEditor}
                        data={desc}
                        // Set editor width to 100% and height to 350px.
                        resize={500}

                        onChange={(event, editor) => {
                            const data = editor.getData()
                            setDesc(data)
                        }}

                    />
                </div>
                <div >
                    <h2 >Content</h2>
                    <p>{parse(desc)}</p>
                </div>
            </div>
            {
                state !== "sending" && state !== "success" &&

                <div className="btnDiv">
                    <button type="submit" className="publishbtn" >Publish</button>
                </div>
            }
            {

                state === "sending" &&
                <div className="btnDiv">
                    <p className="loadingP">Loading</p>
                </div>
            }
        </form>
        // </div>
    )
}


export default Texteditor;