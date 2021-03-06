import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUpPresenter from './SignUpPresenter';

const SignUpContainer = ({ history }) => {
  const { isUser } = useSelector(state => state.auths);
  // 로그인 여부
  useEffect(() => {
    if (isUser !== '') {
      history.push('/'); // 메인 화면으로 이동
    }
  }, [isUser, history]);
  return (
    <>
      <SignUpPresenter></SignUpPresenter>
    </>
  );
};

export default withRouter(SignUpContainer);
