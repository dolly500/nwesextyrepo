import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const PostCard = ({ active, data }) => {
    console.log(data, "post data")
    return (
        <div
            className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"
                } lg:flex p-2`}
        >
            <div className="w-full lg:-w[50%] m-auto">
                <img src={`${data.images[0]?.url}`} alt="" />
            </div>
            <div className="w-full lg:[w-50%] flex flex-col justify-center">
                <h2 className={`${styles.postTitle}`}>{data.name}</h2>
                <p>{data.description}</p>
                
                <br />
                <div className="flex items-center">
                    <Link to={`/post/${data._id}?isPost=true`}>
                        <div className={`${styles.button} text-[#fff]`}>See Details</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
