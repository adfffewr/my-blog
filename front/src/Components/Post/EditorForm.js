import React, { useState, useRef, useEffect, memo } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  POST_ADD_REQUEST,
  POST_DETAIL_LOAD_REQUEST,
  POST_RESET_VIEW_REQUEST,
  POST_DELETE_REQUEST,
} from '../../modules/posts';

import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'highlight.js/styles/github.css';
import Editor from 'tui-editor';
// import Viewer from 'tui-editor/dist/tui-editor-Viewer';
import PostBtnBox from './PostBtnBox';
import Popup from '../Common/Popup';

const TitleInput = styled.input`
  font-size: 2rem;
  font-weight: bold;
  color: #212529;
  margin-bottom: 15px;
  &::placeholder {
    color: #aeb5bd;
  }
  @media screen and (min-width: 768px) {
    font-size: 2.75rem;
  }
`;

const Select = styled.select`
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 5px 10px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
`;

const EditorBox = memo(({ history, location }) => {
  const path = location.pathname.split('/');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('html');
  const [description, setDescription] = useState('');
  const [tags] = useState([]);
  const [url, setUrl] = useState('');
  const [popupToggle, setPopupToggle] = useState(false);
  const [viewContent, setViewContent] = useState('');
  const [first, setFirst] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupText, setPopupText] = useState('');

  const { meta, doc } = useSelector(state => state.posts);

  const titleChange = e => {
    setTitle(e.target.value);
  };

  const categoryChange = e => {
    setCategory(e.target.value);
  };

  const descriptionChange = e => {
    setDescription(e.target.value);
  };

  const urlChange = e => {
    setUrl(e.target.value);
  };

  const EditorElement = useRef(null);
  // const ViewerElement = useRef(null);

  const dispatch = useDispatch();

  if (path.length > 2) {
    const id = path[2] + '_' + path[3];
    useEffect(() => {
      dispatch({
        type: POST_DETAIL_LOAD_REQUEST,
        data: id,
      });
    }, [dispatch, id]);
    useEffect(() => {
      if (Object.keys(meta).length > 0 && first) {
        setTitle(meta.title);
        setCategory(path[2]);
        setUrl(path[3]);
        setDescription(meta.description);
        setViewContent(doc.content);
        setFirst(false);
      }
    }, [meta, doc, path, first]);
  }

  useEffect(() => {
    EditorElement.current = new Editor({
      el: document.querySelector('#editor'),
      initialEditType: 'wysiwyg', // 'markdown'
      previewStyle: 'vertical',
      height: '500px',
      initialValue: viewContent,
      exts: [
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300,
        },
        'scrollSync',
        'colorSyntax',
        'uml',
        'mark',
        'table',
      ],
    });
    dispatch({
      type: POST_RESET_VIEW_REQUEST,
    });
  }, [viewContent, dispatch]);

  const popupOpenEvent = () => {
    path.length > 2
      ? setPopupTitle('포스트 수정')
      : setPopupTitle('포스트 작성');
    path.length > 2
      ? setPopupText('포스트를 수정하시겠습니까?')
      : setPopupText('포스트를 작성하시겠습니까?');
    setPopupToggle(true);
    setDeleteMode(false);
  };

  const popupCloseEvent = () => {
    setPopupToggle(false);
  };

  const postDeleteEvent = () => {
    setPopupTitle('포스트 삭제');
    setPopupText('포스트를 삭제하시겠습니까?');
    setPopupToggle(true);
    setDeleteMode(true);
  };

  const postDelete = () => {
    dispatch({
      type: POST_DELETE_REQUEST,
      data: path[2] + '_' + path[3],
    });
    history.push('/');
  };

  const onSubmit = e => {
    e.preventDefault();
    const content = EditorElement.current.getHtml();

    if (title === '') {
      alert('제목을 입력해 주세요.');
      return;
    }

    if (content === '') {
      alert('내용을 입력해 주세요.');
      return;
    }

    if (url === '') {
      alert('URL을 입력해 주세요.');
      return;
    }

    const today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    let date, createdAt;
    if (path.length > 2) {
      date = meta.date;
      createdAt = meta.createdAt;
    } else {
      date = yyyy + '-' + mm + '-' + dd;
      createdAt = new Date();
    }
    const modifiedAt = new Date();

    dispatch({
      type: POST_ADD_REQUEST,
      data: {
        title,
        category,
        url,
        description,
        date,
        tags,
        content,
        createdAt,
        modifiedAt,
      },
    });
    history.push('/');
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <TitleInput
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={titleChange}
        />
        <Select value={category} onChange={categoryChange}>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
        </Select>

        <div id="editor"></div>
        {/* <div id="viewer"></div> */}
        <PostBtnBox
          popupOpenEvent={popupOpenEvent}
          path={path}
          postDeleteEvent={postDeleteEvent}
        />
        {popupToggle && (
          <Popup
            title={popupTitle}
            popupCloseEvent={popupCloseEvent}
            postPopup
            category={category}
            urlChange={urlChange}
            descriptionChange={descriptionChange}
            description={description}
            url={url}
            deleteMode={deleteMode}
            postDelete={postDelete}
          >
            {popupText}
          </Popup>
        )}
      </form>
    </>
  );
});

export default withRouter(EditorBox);
