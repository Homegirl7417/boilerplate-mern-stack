import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Primary, setPrimary] = useState(0); //Primary = 0, Publick = 1
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value);
    };
    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    };
    const onPrivateChange = (event) => {
        setPrimary(event.currentTarget.value)
    };
    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value)
    };
    const onDrop = (files) => {
        //files를 보낼때 아래 코드를 써야 오류가 안남.
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.url);
                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.url);
                            }
                            else {
                                alert("썸네일 전송 실패");
                            }
                        })
                }
                else {
                    alert("비디오 전송 실패");
                }
            });
    } 

    const onSubmit = (e) => {
        e.preventDefault();
        const variables = {
            //reduxHook을 이용해 유저 정보 가져오기.
            writer: user.userData._id,
            title: VideoTitle,
            descriptions: Description,
            privacy: Primary,
            filePath: FilePath,
            catogory: Category,
            // views: 0,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
                    message.success('업로드 성공');
                    setTimeout(() => {
                        props.history.push('/');
                    }, 3000)
                } else {
                    alert('비디오 업로드 실패');
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>
                    {/*섬네일 */}
                
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="Thumbnail" />
                        </div> 
                    }
                </div>
                    <br/>
                    <br/>
                    <label>Title</label>
                    <Input
                        onChange={onTitleChange}
                        value={VideoTitle}
                    />
                    <br/>
                    <br/>
                    <label>Description</label>
                    <TextArea
                        onChange={onDescriptionChange}
                        value={Description}
                    />
                    <br/>
                    <br/>

                    <select onChange={onPrivateChange}>
                        {PrivateOptions.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <br/>
                    <br/>

                    <select onChange={onCategoryChange}>
                        {CategoryOptions.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <br/>
                    <br/>

                    <Button type="primary" size="large" onClick={onSubmit}>
                        Submit
                    </Button>
            </Form>
        </div>
    );
}

export default VideoUploadPage;